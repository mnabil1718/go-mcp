import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';

import * as ChatSelectors from '../../../chat/store/chat.selector';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ChatNavComponent } from '../../../chat/nav/nav.component';
import { NavItemComponent } from './nav.item.component';
import { staticNavigations } from './sidenav.data';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavService } from './sidenav.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'sidenav',
  imports: [
    MatListModule,
    MatIconModule,
    MatDividerModule,
    AsyncPipe,
    MatButtonModule,
    MatMenuModule,
    ChatNavComponent,
    NavItemComponent,
    MatSidenavModule,
  ],
  templateUrl: 'sidenav.template.html',
  styleUrl: 'sidenav.css',
})
export class SidenavComponent {
  private store = inject(Store);
  private router = inject(Router);
  service = inject(SidenavService);
  chats$ = this.store.select(ChatSelectors.selectChats);
  staticNavigations = staticNavigations;

  // on mobile, close sidenav after navigation ended
  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd && this.service.isMobile()) {
        this.service.toggle();
      }
    });
  }
}
