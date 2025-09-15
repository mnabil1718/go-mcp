import { Injectable, signal } from '@angular/core';
import { sign } from 'crypto';
import { response } from 'express';

@Injectable({ providedIn: 'root' })
export class ChatService {
  answer = signal<string>('');
  error = signal<string | null>(null);
  done = signal<boolean>(false);

  async chat(message: string): Promise<void> {
    this.answer.set('');
    this.error.set(null);
    this.done.set(false);
    try {
      const URL = 'http://localhost:8080/chat';
      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!res.body) {
        throw new Error('no response body');
      }

      const reader = res.body.getReader();
      const dec = new TextDecoder();

      while (true) {
        const { done: isDone, value } = await reader.read();
        if (isDone) break;
        const chunk = dec.decode(value, { stream: true });
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const json = line.replace(/^data:\s*/, '').trim();
            if (!json) continue;

            const parsed = JSON.parse(json);

            if (parsed.done) {
              this.done.set(true);
              return;
            }
            this.answer.update((a) => a + parsed.message.content);
          }
        }
      }
    } catch (error: any) {
      console.log(error);
      this.error.set(error.message);
    }
  }
}
