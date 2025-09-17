import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Conversation, Message, PostConvRes } from './chat.domain';
import { ApiResponse } from '../common/api/api.domain';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  messages = signal<Message[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  async createConversation(): Promise<string> {
    const res = await fetch(`${environment.apiUrl}/conversations`, { method: 'POST' });
    if (!res.ok) throw new Error('failed to create conversation');
    const json: ApiResponse<PostConvRes> = await res.json();
    if (!json.data) {
      throw new Error(json.message ?? 'conversation_id missing in response');
    }
    const id = json.data.conversation_id;
    if (!id) throw new Error('conversation_id missing in response');
    return id;
  }

  async getConversation(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await fetch(`${environment.apiUrl}/conversations/${id}`);
      if (!res.ok) throw new Error('failed to load conversation');

      const json: ApiResponse<Conversation> = await res.json();
      this.messages.set(json.data?.messages ?? []);
    } catch (err: any) {
      this.error.set(err.message);
    } finally {
      this.loading.set(false);
    }
  }

  async sendMessage(convId: string, message: string): Promise<void> {
    this.messages.update((msgs) => {
      return [...msgs, { role: 'user', content: message, sent_at: new Date().toISOString() }];
    });

    try {
      const res = await fetch(`${environment.apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: convId, message }),
      });

      if (!res.body) throw new Error('no response body');

      const reader = res.body.getReader();
      const dec = new TextDecoder();

      // insert assistant bubble
      let assistant: Message = {
        role: 'assistant',
        content: '',
        sent_at: new Date().toISOString(),
      };
      this.messages.update((msgs) => [...msgs, assistant]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = dec.decode(value, { stream: true });
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const json = line.replace(/^data:\s*/, '').trim();
            if (!json) continue;

            const parsed = JSON.parse(json);
            if (parsed.done) return;

            if (parsed.message?.content) {
              this.messages.update((msgs) => {
                const updated = [...msgs];
                const last = updated[updated.length - 1];
                if (last.role === 'assistant') {
                  last.content += parsed.message.content;
                }
                return updated;
              });
            }
          }
        }
      }
    } catch (err: any) {
      this.error.set(err.message);
    }
  }
}
