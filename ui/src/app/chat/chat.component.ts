import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ChatBubbleComponent } from './chat.bubble.component';
import { ChatboxComponent } from '../common/chatbox/chatbox.component';
import { ChatLoaderComponent } from './chat-loader.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChatActions } from './store/chat.action';
import * as ChatSelectors from './store/chat.selector';
import { AsyncPipe } from '@angular/common';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'chat',
  imports: [
    FormsModule,
    ChatboxComponent,
    ChatBubbleComponent,
    ChatLoaderComponent,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
  ],
  templateUrl: 'chat.template.html',
  styleUrl: './chat.css',
  host: {
    class: 'flex flex-col flex-1 min-h-0 w-full relative',
  },
})
export class ChatComponent {
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);

  @ViewChild('messageContainer') messageContainer!: ElementRef<HTMLDivElement>;
  scrolledUp = signal<boolean>(false);

  messages$ = this.store.select(ChatSelectors.selectMessages);
  response$ = this.store.select(ChatSelectors.selectResponse);
  thinking$ = this.store.select(ChatSelectors.selectThinking);
  generating$ = this.store.select(ChatSelectors.selectGenerating);
  selectedChatId$ = this.store.select(ChatSelectors.selectSelectedChatId);

  constructor() {
    // dispatch load chat on route change
    // // auto-scroll when messages change
    // effect(() => {
    //   this.messages$.subscribe((messages) => {
    //     if (!this.scrolledUp() && messages.length > 0) {
    //       afterNextRender(() => this.scrollToBottom());
    //     }
    //   });
    // });
    // // auto-scroll when response chunks stream in
    // effect(() => {
    //   this.response$.subscribe((resp) => {
    //     if (resp && !this.scrolledUp()) {
    //       afterNextRender(() => this.scrollToBottom());
    //     }
    //   });
    // });
  }

  ngAfterViewInit() {
    const el = this.messageContainer.nativeElement;
    el.addEventListener('scroll', () => {
      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
      this.scrolledUp.set(!isAtBottom);
    });
  }

  send(prompt: string) {
    // this.selectedChat$
    //   .subscribe((ch) => {
    //     if (ch) {
    //       this.store.dispatch(ChatActions.saveMessage({ chat_id: ch.id, message: prompt }));
    //       this.store.dispatch(ChatActions.respond({ id: ch.id }));
    //     }
    //   })
    //   .unsubscribe(); // unsubscribe because we just need the latest value once
  }

  scrollToBottom(): void {
    this.messageContainer.nativeElement.scroll({
      top: this.messageContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }
}
