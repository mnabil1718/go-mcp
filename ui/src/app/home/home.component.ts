import { Component, inject } from '@angular/core';
import { ChatboxComponent } from '../common/chatbox/chatbox.component';
import { ChatService } from '../chat/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'home',
  imports: [ChatboxComponent],
  templateUrl: 'home.template.html',
  host: {
    class: 'flex flex-col flex-1 justify-center items-center p-3',
  },
})
export class HomeComponent {
  private router = inject(Router);
  private chat = inject(ChatService);

  createAndNavigateToChat(prompt: string) {
    this.chat.create({ title: 'aaa' }).subscribe({
      next: (ch) => {
        this.chat.saveMessage({ chat_id: ch.id, message: prompt }).subscribe({
          next: () => {
            this.chat.respond(ch.id).subscribe();
          },
        });
        this.router.navigate(['/c', ch.id]);
      },
    });
  }
}
