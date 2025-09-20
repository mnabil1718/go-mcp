// chat.component.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatBubbleComponent } from './chat.bubble.component';
import { CommonModule } from '@angular/common';
import { ChatService } from './chat.service';

@Component({
  selector: 'chat',
  imports: [
    FormsModule,
    // ChatBubbleComponent,
    CommonModule,
  ],
  templateUrl: 'chat.template.html',
})
export class ChatComponent {
  private route = inject(ActivatedRoute);
  private chat = inject(ChatService);

  chat_id = '';
  prompt = '';

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.chat_id = params.get('id')!;
      this.chat.getById(this.chat_id);
    });
  }

  send() {
    // if (!this.prompt.trim()) return;
    // this.convo.sendMessage(this.convId, this.prompt);
    // this.prompt = '';
  }
}
