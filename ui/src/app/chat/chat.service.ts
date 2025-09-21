import { inject, Injectable, signal } from '@angular/core';
import { Message, OllamaMessage } from '../message/message.domain';
import { Chat, ChatWithMessages, CreateChatRequest, SaveMessageRequest } from './chat.domain';
import { ApiService } from '../common/api/api.service';
import { Observable, tap } from 'rxjs';
import { Chunk } from '../common/api/api.domain';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private api = inject(ApiService);

  chats = signal<Chat[]>([]);
  selectedChat = signal<Chat | null>(null);
  selectedChatMessages = signal<Message[]>([]);
  response = signal<string | null>(null);
  loading = signal<boolean>(false);

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
    const msg: Message = {
      id: crypto.randomUUID(),
      chat_id: r.chat_id,
      content: r.message,
      role: 'user',
      sent_at: new Date().toISOString(),
    };

    this.selectedChatMessages.update((oldMsg) => [...oldMsg, msg]);

    return this.api.post<Message>(`chats/${r.chat_id}/messages`, { message: r.message });
  }

  respond(id: string): Observable<Chunk<OllamaMessage>> {
    this.loading.set(true);
    let replyBuffer = '';

    return new Observable<Chunk<OllamaMessage>>((subscriber) => {
      const sub = this.api.stream<OllamaMessage>(`chats/${id}/generate`).subscribe({
        next: (chunk) => {
          if (chunk.event === 'message' && chunk.data) {
            replyBuffer += chunk.data.content; // append token to buffer
            this.loading.set(false);
            this.response.set(replyBuffer);
            subscriber.next(chunk);
          }
        },
        error: (err) => {
          this.loading.set(false);
          subscriber.error(err);
        },
        complete: () => {
          const reply: Message = {
            role: 'assistant',
            chat_id: id,
            content: replyBuffer,
            id: crypto.randomUUID(),
            sent_at: new Date().toISOString(),
          };
          this.selectedChatMessages.update((msgs) => [...msgs, reply]);

          this.loading.set(false);
          this.response.set(null);
        },
      });

      // Cleanup when unsubscribed
      return () => {
        this.loading.set(false);
        sub.unsubscribe();
      };
    });
  }
}
