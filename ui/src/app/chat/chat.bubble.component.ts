// chat.bubble.component.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'chat-bubble',
  styleUrl: 'chat.css',
  template: `
    @if (role() === 'assistant') {
    <ul class="w-full">
      <div class="max-w-full p-3 whitespace-pre-line">
        {{ message() }}
      </div>
    </ul>
    } @else if (role() === 'user') {
    <ul class="flex justify-end">
      <div class="max-w-xs rounded-lg p-3 chat-bubble-user whitespace-pre-line">
        {{ message() }}
      </div>
    </ul>
    }
  `,
})
export class ChatBubbleComponent {
  role = input.required<'user' | 'assistant'>();
  message = input.required<string>();
}
