import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';

import * as ChatSelectors from '../../chat/store/chat.selector';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sidenav-component',
  imports: [MatListModule, MatIconModule, MatDividerModule, AsyncPipe, RouterLink],
  templateUrl: './sidenav.template.html',
})
export class SidenavComponent {
  private store = inject(Store);

  chats$ = this.store.select(ChatSelectors.selectChats);
}
