import { Component, input } from '@angular/core';
import { MarkdownComponent } from '../common/md/markdown.component';

@Component({
  selector: 'message',
  styleUrl: './message.css',
  template: `
    @if (role() === 'assistant') {
    <ul class="w-full">
      <!-- <div class="max-w-full p-3 whitespace-pre-line">
        {{ message() }}
      </div> -->
      <markdown [content]="message()" />
    </ul>
    } @else if (role() === 'user') {
    <ul class="flex justify-end">
      <div class="message-user max-w-xs rounded-lg p-3 whitespace-pre-line">
        {{ message() }}
      </div>
    </ul>
    }
  `,
  imports: [MarkdownComponent],
})
export class MessageComponent {
  role = input.required<'user' | 'assistant'>();
  message = input.required<string>();
}
