import { Component, computed, input, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive, UrlTree } from '@angular/router';
import { SidenavItemMenu } from './sidenav.domain';

@Component({
  selector: 'sidenav-item-component',
  imports: [
    MatListModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  template: `
    <!-- Changing element [active] to "true" if routerLinkActive matches -->
    <mat-list-item
      [activated]="rla.isActive"
      (mouseenter)="hovered.set(true)"
      (mouseleave)="hovered.set(false)"
      class="relative"
    >
      @if(icon()) {
      <mat-icon matListItemIcon fontSet="material-symbols-outlined">{{ icon() }}</mat-icon>
      } @if (itemMenuLength() > 0 && (hovered() || menuOpened())) {
      <div matListItemMeta class="!mr-1">
        <button
          matIconButton
          [matMenuTriggerFor]="menu"
          (menuOpened)="menuOpened.set(true)"
          (menuClosed)="menuOpened.set(false)"
        >
          <mat-icon>more_horiz</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          @for (item of itemMenu(); track $index) {
          <button (click)="item.actionCallback()" mat-menu-item>{{ item.label }}</button>
          }
        </mat-menu>
      </div>
      }
      <a
        #rla="routerLinkActive"
        matListItemTitle
        [routerLink]="routerLinkParam()"
        [routerLinkActiveOptions]="{ exact: true }"
        routerLinkActive
      >
        <span class="mat-label-large">
          {{ label() }} dan kita semua bisa berdamai dengan situasi saat ini
        </span>
      </a>
    </mat-list-item>
  `,
})
export class SidenavItemComponent {
  readonly icon = input<string>();
  readonly label = input.required<string | undefined>();
  readonly routerLinkParam = input.required<string | readonly any[] | UrlTree | null | undefined>();
  readonly itemMenu = input<SidenavItemMenu>();
  readonly itemMenuLength = computed(() => this.itemMenu()?.length ?? 0);
  hovered = signal<boolean>(false);
  menuOpened = signal<boolean>(false);

  clickMenu() {
    console.log('menu');
  }

  clickLink() {
    console.log('link');
  }
}
