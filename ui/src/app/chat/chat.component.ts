import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
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
import { toSignal } from '@angular/core/rxjs-interop';

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
  followAutoScroll = signal<boolean>(false);
  showFab = signal<boolean>(false);

  messages$ = this.store.select(ChatSelectors.selectMessages);
  thinking$ = this.store.select(ChatSelectors.selectThinking);
  generating$ = this.store.select(ChatSelectors.selectGenerating);
  selectedChatId$ = this.store.select(ChatSelectors.selectSelectedChatId);

  private lastScrollTop = 0;
  messagesSignal = toSignal(this.messages$);

  ngAfterViewInit() {
    this.setSignals();
  }

  onMessagesChange = effect(() => {
    if (this.messagesSignal() && this.followAutoScroll()) {
      this.autoScroll();
    }
  });

  onScroll() {
    this.setSignals();
  }

  private setSignals() {
    if (!this.messageContainer) return;

    const el = this.messageContainer.nativeElement;
    const current = el.scrollTop;

    this.scrolledUp.set(current < this.lastScrollTop);
    this.followAutoScroll.set(this.isNearBottom(50) && !this.scrolledUp());
    this.showFab.set(!this.isNearBottom(200));

    // remember position for next scroll event
    this.lastScrollTop = current;
  }

  onShowFab = effect(() => {
    console.log('states', {
      scrolledUp: this.scrolledUp(),
      followScroll: this.followAutoScroll(),
    });
  });

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
    const el = this.messageContainer.nativeElement;
    el.scroll({
      top: el.scrollHeight,
      behavior: 'smooth',
    });
  }

  private autoScroll() {
    setTimeout(() => this.scrollToBottom(), 1);
  }

  private isNearBottom(threshold: number = 50): boolean {
    const el = this.messageContainer.nativeElement;
    const position = el.scrollTop + el.clientHeight;
    return position >= el.scrollHeight - threshold;
  }
}
