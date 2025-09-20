import { inject, Injectable, signal } from '@angular/core';
import { Message, OllamaMessage } from '../message/message.domain';
import {
  Chat,
  ChatRequest,
  ChatWithMessages,
  CreateChatRequest,
  SaveMessageRequest,
} from './chat.domain';
import { ApiService } from '../common/api/api.service';
import { Observable, tap } from 'rxjs';
import { Chunk } from '../common/api/api.domain';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private api = inject(ApiService);

  chats = signal<Chat[]>([]);
  selectedChat = signal<Chat | null>(null);
  selectedChatMessages = signal<Message[]>([]);

  create(body: CreateChatRequest): Observable<Chat> {
    return this.api.post<Chat>('chats', body).pipe(
      tap({
        next: (chat) => {
          this.chats.update((chats) => [...chats, chat]);
        },
      })
    );
  }

  getById(id: string): Observable<ChatWithMessages> {
    return this.api.get<ChatWithMessages>(`chats/${id}`).pipe(
      tap({
        next: (chat) => {
          this.selectedChat.set({
            id: chat.id,
            title: chat.title,
            created_at: chat.created_at,
          });
          this.selectedChatMessages.set(chat.messages);
        },
      })
    );
  }

  saveMessage(r: SaveMessageRequest): Observable<Message> {
    return this.api.post<Message>(`chats/${r.chat_id}/messages`, { message: r.message }).pipe(
      tap({
        next: (msg) => {
          this.selectedChatMessages.update((old) => [...old, msg]);
        },
      })
    );
  }

  chat(r: ChatRequest) {
    // save user prompt
    this.saveMessage(r).subscribe();

    let replyBuffer = '';

    return new Observable<Chunk<string>>((subscriber) => {
      const sub = this.api.stream<OllamaMessage>(`chats/${r.chat_id}/generate`).subscribe({
        next: (chunk) => {
          if (chunk.event === 'message' && chunk.data) {
            replyBuffer += chunk.data.content; // append token to buffer

            // Emit a "typing" event with current buffer
            subscriber.next({ event: 'typing', data: replyBuffer });
          }

          if (chunk.event === 'done') {
            // Save final assistant message to state
            const reply: Message = {
              role: 'assistant',
              chat_id: r.chat_id,
              content: replyBuffer,
              id: crypto.randomUUID(),
              sent_at: new Date().toISOString(),
            };
            this.selectedChatMessages.update((msgs) => [...msgs, reply]);

            subscriber.next({ event: 'done', data: replyBuffer });
            subscriber.complete();
          }
        },
        error: (err) => subscriber.error(err),
      });

      // Cleanup when unsubscribed
      return () => sub.unsubscribe();
    });
  }
}
