import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ChatboxComponent } from '../common/chatbox/chatbox.component';
import { ChatLoaderComponent } from './chat-loader.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChatActions } from './store/chat.action';
import * as ChatSelectors from './store/chat.selector';
import { AsyncPipe } from '@angular/common';
import { take } from 'rxjs';
import { MessageComponent } from '../message/message.component';
import { MarkdownComponent } from '../common/md/markdown.component';

@Component({
  selector: 'chat',
  imports: [
    FormsModule,
    ChatboxComponent,
    ChatLoaderComponent,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
    MessageComponent,
    MarkdownComponent,
  ],
  templateUrl: 'chat.template.html',
  styleUrl: './chat.css',
  host: {
    class: 'flex flex-col flex-1 min-h-0 w-full relative',
  },
})
export class ChatComponent {
  private store = inject(Store);

  @ViewChild('messageContainer') messageContainer!: ElementRef<HTMLDivElement>;
  scrolledUp = signal<boolean>(false);

  messages$ = this.store.select(ChatSelectors.selectMessages);
  response$ = this.store.select(ChatSelectors.selectResponse);
  thinking$ = this.store.select(ChatSelectors.selectThinking);
  generating$ = this.store.select(ChatSelectors.selectGenerating);
  selectedChatId$ = this.store.select(ChatSelectors.selectSelectedChatId);

  constructor() {
    // auto-scroll effect
    this.messages$.subscribe(() => this.autoScroll());
    this.response$.subscribe(() => this.autoScroll());
  }

  ngAfterViewInit() {
    const el = this.messageContainer.nativeElement;
    el.addEventListener('scroll', () => {
      this.scrolledUp.set(!this.isUserNearBottom());
    });
  }

  send(prompt: string) {
    this.selectedChatId$.pipe(take(1)).subscribe((id) => {
      if (id) {
        this.store.dispatch(
          ChatActions.sendOptimistic({
            temp_id: crypto.randomUUID(),
            chat_id: id,
            message: prompt,
          })
        );
      }
    });
  }

  scrollToBottom(): void {
    this.messageContainer.nativeElement.scroll({
      top: this.messageContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }

  private autoScroll() {
    // wait for Angular to render new items
    setTimeout(() => this.scrollToBottom(), 50);
  }

  private isUserNearBottom(): boolean {
    const el = this.messageContainer.nativeElement;
    const threshold = 150;
    const position = el.scrollTop + el.offsetHeight;
    const height = el.scrollHeight;
    return position > height - threshold;
  }
}
