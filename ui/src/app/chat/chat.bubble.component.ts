// chat.bubble.component.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'chat-bubble',
  template: `
    @if (role() === 'assistant') {
    <div class="flex justify-start">
      <div class="max-w-full p-5 text-slate-700">
        {{ message() }}
      </div>
    </div>
    } @else {
    <div class="flex justify-end">
      <div class="max-w-xs rounded-lg shadow p-3 bg-indigo-600 text-white">
        {{ message() }}
      </div>
    </div>
    }
  `,
})
export class ChatBubbleComponent {
  role = input<'user' | 'assistant'>();
  message = input<string>();
}
