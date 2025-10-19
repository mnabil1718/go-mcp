import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';

import * as ChatSelectors from '../../chat/store/chat.selector';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ChatNavComponent } from '../../chat/chat.nav.component';

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
    ChatNavComponent,
  ],
  templateUrl: 'sidenav.template.html',
})
export class SidenavComponent {
  private store = inject(Store);
  chats$ = this.store.select(ChatSelectors.selectChats);
}
