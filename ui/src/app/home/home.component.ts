import { Component, inject } from '@angular/core';
import { ChatboxComponent } from '../common/components/chatbox/chatbox.component';
import { Store } from '@ngrx/store';
import { ChatActions } from '../chat/store/chat.action';

@Component({
  selector: 'home',
  imports: [ChatboxComponent],
  templateUrl: 'home.template.html',
  host: {
    class: 'flex flex-col flex-1 justify-center items-center p-3',
  },
})
export class HomeComponent {
  private store = inject(Store);

  createAndNavigateToChat(prompt: string) {
    this.store.dispatch(ChatActions.createOptimistic({ prompt, temp_id: crypto.randomUUID() }));
  }
}
