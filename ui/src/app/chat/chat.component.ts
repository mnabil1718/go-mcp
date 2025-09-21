// chat.component.ts
import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatBubbleComponent } from './chat.bubble.component';
import { CommonModule } from '@angular/common';
import { ChatService } from './chat.service';
import { ChatboxComponent } from '../common/chatbox/chatbox.component';
import { ChatLoaderComponent } from './chat-loader.component';

@Component({
  selector: 'chat',
  imports: [FormsModule, ChatboxComponent, ChatBubbleComponent, ChatLoaderComponent],
  templateUrl: 'chat.template.html',
  styleUrl: './chat.css',
  host: {
    class: 'flex flex-col flex-1',
  },
})
export class ChatComponent {
  private route = inject(ActivatedRoute);
  chat = inject(ChatService);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      this.activatedRoute.params.subscribe((params) => {
        this.chat.getById(params['id']).subscribe();
      });
    });
  }

  send(prompt: string) {
    const ch = this.chat.selectedChat();
    if (ch !== null) {
      this.chat.saveMessage({ chat_id: ch.id, message: prompt }).subscribe({
        next: () => {
          this.chat.respond(ch.id).subscribe();
        },
      });
    }
  }
}
