import {
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../common/api/api.service';
import { ConversationService } from '../chat/chat.service';
import { ApiResponse } from '../common/api/api.domain';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { Conversation } from '../chat/chat.domain';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
  ],
  styleUrl: 'home.css',
  templateUrl: 'home.template.html',
})
export class HomeComponent {
  conversations: Conversation[] = [];

  private api = inject(ApiService);
  private conv = inject(ConversationService);
  private router = inject(Router);

  @ViewChild('chat') chat!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  sendUp = signal<boolean>(false);

  ngAfterViewInit() {
    this.autosize.resizeToFitContent(true);
  }

  onInput() {
    const el = this.chat.nativeElement;
    const charCount: number = el.value.length;
    this.sendUp.set(charCount > 56);
  }

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
      this.router.navigate(['/c', convId]);
    } catch (err: any) {
      console.error('Failed to create conversation', err);
    }
  }
}
