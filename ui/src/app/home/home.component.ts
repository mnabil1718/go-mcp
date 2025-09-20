import { Component, inject } from '@angular/core';
import { ChatboxComponent } from '../common/chatbox/chatbox.component';
import { ChatService } from '../chat/chat.service';

@Component({
  selector: 'home',
  imports: [ChatboxComponent],
  templateUrl: 'home.template.html',
})
export class HomeComponent {
  private chat = inject(ChatService);
  createAndNavigateToChat(prompt: string) {
    // call chat service to create new chat, get id back
    // navigate to /c/:chat_id
    this.chat.create({ title: 'aaa' }).subscribe({
      next: (ch) => {
        // navigate to new route
      },
    });
  }
}
