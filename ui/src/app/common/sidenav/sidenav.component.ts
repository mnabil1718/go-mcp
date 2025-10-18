import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { Chat } from '../../chat/chat.domain';

import * as ChatSelectors from '../../chat/store/chat.selector';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { SidenavItemComponent } from './sidenav.item.component';
import { SidenavItemMenu } from './sidenav.domain';

@Component({
  selector: 'sidenav-component',
  imports: [
    MatListModule,
    MatIconModule,
    MatDividerModule,
    AsyncPipe,
    RouterLink,
    MatButtonModule,
    MatMenuModule,
    SidenavItemComponent,
  ],
  templateUrl: './sidenav.template.html',
})
export class SidenavComponent {
  private store = inject(Store);
  chats$ = this.store.select(ChatSelectors.selectChats);

  getChatMenu(chat: Chat): SidenavItemMenu {
    return [
      { label: 'Rename', actionCallback: () => alert('rename') },
      { label: 'Delete', actionCallback: () => alert('delete') },
    ];
  }
}
