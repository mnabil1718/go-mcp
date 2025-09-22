import { Component } from '@angular/core';

@Component({
  selector: 'chat-loader',
  styleUrl: 'chat.css',
  template: `
    <li class="chat-loader flex items-center space-x-1.5">
      <span class="w-2 h-2 rounded-full animate-bounce [animation-delay:0ms]"></span>
      <span class="w-2 h-2 rounded-full animate-bounce [animation-delay:200ms]"></span>
      <span class="w-2 h-2 rounded-full animate-bounce [animation-delay:400ms]"></span>
    </li>
  `,
})
export class ChatLoaderComponent {}
