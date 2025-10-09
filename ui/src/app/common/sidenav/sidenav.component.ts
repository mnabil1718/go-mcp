import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';

import * as ChatSelectors from '../../chat/store/chat.selector';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink, UrlSegment } from '@angular/router';

@Component({
  selector: 'sidenav-component',
  imports: [MatListModule, MatIconModule, MatDividerModule, AsyncPipe, RouterLink],
  templateUrl: './sidenav.template.html',
})
export class SidenavComponent {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  chats$ = this.store.select(ChatSelectors.selectChats);

  readonly activeChatId: string | null;

  constructor() {
    this.activeChatId = this.route.snapshot.paramMap.get('id');
  }
}
