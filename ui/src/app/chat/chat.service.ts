import { inject, Injectable } from '@angular/core';
import { Message, OllamaMessage } from '../message/message.domain';
import { Chat, ChatWithMessages, SaveMessageRequest } from './chat.domain';
import { ApiService } from '../common/api/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private api = inject(ApiService);

  create(): Observable<Chat> {
    return this.api.post<Chat>('chats', null);
  }

  getChats(): Observable<Chat[]> {
    return this.api.get<Chat[]>('chats');
  }

  getById(id: string): Observable<ChatWithMessages> {
    return this.api.get<ChatWithMessages>(`chats/${id}`);
  }

  generateTitle(id: string): Observable<Chat> {
    return this.api.post<Chat>(`chats/${id}/generate-title`, null);
  }

  saveMessage(r: SaveMessageRequest): Observable<Message> {
    return this.api.post<Message>(`chats/${r.chat_id}/messages`, { message: r.message });
  }

  respond(id: string): Observable<OllamaMessage | Message> {
    let replyBuffer = '';

    return new Observable<OllamaMessage | Message>((subscriber) => {
      const sub = this.api.stream<OllamaMessage>(`chats/${id}/generate`).subscribe({
        next: (chunk) => {
          if (chunk.event === 'message' && chunk.data) {
            replyBuffer += chunk.data.content;
            subscriber.next(chunk.data);
          } else if (chunk.event === 'done') {
            const reply: Message = {
              role: 'assistant',
              chat_id: id,
              content: replyBuffer,
              id: crypto.randomUUID(),
              sent_at: new Date().toISOString(),
            };
            subscriber.next(reply);
            subscriber.complete();
          }
        },
        error: (err) => subscriber.error(err),
      });

      return () => sub.unsubscribe(); // cleanup
    });
  }
}
