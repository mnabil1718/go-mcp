// chat.component.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConversationService } from './chat.service';
import { ChatBubbleComponent } from './chat.bubble.component';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'chat',
  imports: [FormsModule, ChatBubbleComponent, CommonModule],
  templateUrl: 'chat.template.html',
})
export class ChatComponent {
  private route = inject(ActivatedRoute);
  convo = inject(ConversationService);

  convId = '';
  prompt = '';

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.convId = params.get('id')!;
      this.convo.getConversation(this.convId);
    });
  }

  send() {
    if (!this.prompt.trim()) return;
    this.convo.sendMessage(this.convId, this.prompt);
    this.prompt = '';
  }
}
