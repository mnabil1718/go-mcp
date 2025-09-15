import { Component, inject } from '@angular/core';
import { ChatService } from './chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'chat',
  imports: [FormsModule],
  template: `
    <h2>AI Chat</h2>
    <input [(ngModel)]="prompt" placeholder="Ask something..." />
    <button (click)="send()">Send</button>

    <div class="response">
      {{ chatService.answer() }}
    </div>

    @if (chatService.error()) {
    <div>❌ {{ chatService.error() }}</div>
    }
  `,
})
export class ChatComponent {
  prompt = '';
  chatService = inject(ChatService);

  send() {
    this.chatService.chat(this.prompt);
  }
}
