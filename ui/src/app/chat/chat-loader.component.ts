import { Component } from '@angular/core';

@Component({
  selector: 'chat-loader',
  styleUrl: 'chat.css',
  template: `
    <div class="p-3">
      <div class="chat-loader w-3 h-3 rounded-full animate-ping"></div>
    </div>
  `,
})
export class ChatLoaderComponent {}
