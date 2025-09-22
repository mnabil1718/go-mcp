// chat.component.ts
import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatBubbleComponent } from './chat.bubble.component';
import { ChatService } from './chat.service';
import { ChatboxComponent } from '../common/chatbox/chatbox.component';
import { ChatLoaderComponent } from './chat-loader.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'chat',
  imports: [
    FormsModule,
    ChatboxComponent,
    ChatBubbleComponent,
    ChatLoaderComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: 'chat.template.html',
  styleUrl: './chat.css',
  host: {
    class: 'flex flex-col flex-1 min-h-0 w-full relative',
  },
})
export class ChatComponent {
  chat = inject(ChatService);
  private activatedRoute = inject(ActivatedRoute);

  @ViewChild('messageContainer') messageContainer!: ElementRef<HTMLDivElement>;
  scrolledUp = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.activatedRoute.params.subscribe((params) => {
        this.chat.getById(params['id']).subscribe();
      });
    });

    effect(() => {
      const messages = this.chat.selectedChatMessages();

      // only scroll if user is NOT scrolled up
      if (!this.scrolledUp() && messages.length > 0) {
        queueMicrotask(() => this.scrollToBottom());
      }
    });

    // also watch for streaming response (LLM typing)
    effect(() => {
      const resp = this.chat.response();
      if (resp && !this.scrolledUp()) {
        queueMicrotask(() => this.scrollToBottom());
      }
    });
  }

  ngAfterViewInit() {
    const el = this.messageContainer.nativeElement;

    el.addEventListener('scroll', () => {
      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20; // 20px tolerance

      this.scrolledUp.set(!isAtBottom); // true if NOT at bottom
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

  private onMessagesChanged() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.messageContainer.nativeElement.scroll({
      top: this.messageContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }
}
