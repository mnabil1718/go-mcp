import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../common/api.service';
import { ConversationService } from '../chat/chat.service';
import { ApiResponse } from '../common/api.domain';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="newConversation()">➕ New Conversation</button>
    <button (click)="loadConversations()">Load Conversations</button>

    <div *ngFor="let conv of conversations">
      {{ conv.id }} — {{ conv.created_at | date : 'short' }}
    </div>
  `,
})
export class HomeComponent implements OnInit {
  conversations: any[] = [];

  private api = inject(ApiService);
  private conv = inject(ConversationService);
  private router = inject(Router);

  ngOnInit(): void {}

  loadConversations() {
    this.api.get<ApiResponse<any[]>>('conversations').subscribe({
      next: (res) => {
        if (res.data) {
          this.conversations = res.data;
        }
      },
      error: (err: Error) => alert(err.message),
    });
  }

  async newConversation() {
    try {
      const convId = await this.conv.createConversation();
      this.router.navigate(['/c', convId]); // ✅ navigate to chat view
    } catch (err: any) {
      console.error('Failed to create conversation', err);
    }
  }
}
