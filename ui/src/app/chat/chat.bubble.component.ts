// chat.bubble.component.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'chat-bubble',
  styleUrl: 'chat.css',
  template: `
    @if (role() === 'assistant') {
    <ul class="w-full">
      <div class="max-w-full p-5">
        {{ message() }}
      </div>
    </ul>
    } @else if (role() === 'user') {
    <div class="flex justify-end">
      <div class="max-w-xs rounded-lg p-3 chat-bubble-user">
        {{ message() }}
      </div>
    </div>
    }
  `,
})
export class ChatBubbleComponent {
  role = input.required<'user' | 'assistant'>();
  message = input.required<string>();
}
