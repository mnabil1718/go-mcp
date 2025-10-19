import { Component, computed, input, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive, UrlTree } from '@angular/router';
import { SidenavItemMenu } from './sidenav.domain';

@Component({
  selector: 'nav-item-component',
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
      #rla="routerLinkActive"
      [routerLink]="routerLinkParam()"
      [routerLinkActiveOptions]="{ exact: true }"
      routerLinkActive
      (mouseenter)="hovered.set(true)"
      (mouseleave)="hovered.set(false)"
      class="relative"
    >
      @if(icon()) {
      <mat-icon matListItemIcon fontSet="material-symbols-outlined">{{ icon() }}</mat-icon>
      } @if (itemMenuLength() > 0 && (hovered() || menuOpened())) {
      <!-- click without navigate, use $event.stopPropagation() -->
      <button
        matListItemMeta
        matIconButton
        [matMenuTriggerFor]="menu"
        (menuOpened)="menuOpened.set(true)"
        (menuClosed)="menuOpened.set(false)"
        (click)="$event.stopPropagation()"
        class="cursor-pointer right-0 !mr-1 flex items-center"
      >
        <mat-icon>more_horiz</mat-icon>
        <mat-menu #menu="matMenu">
          @for (item of itemMenu(); track $index) {
          <button (click)="item.actionCallback()" mat-menu-item>{{ item.label }}</button>
          }
        </mat-menu>
      </button>
      }

      <h2 matListItemTitle class="w-full block">
        <span class="mat-label-large">
          {{ label() }}
        </span>
      </h2>
    </mat-list-item>
  `,
})
export class NavItemComponent {
  readonly icon = input<string>();
  readonly label = input.required<string | undefined>();
  readonly routerLinkParam = input.required<string | readonly any[] | UrlTree | null | undefined>();
  readonly itemMenu = input<SidenavItemMenu>();
  readonly itemMenuLength = computed(() => this.itemMenu()?.length ?? 0);
  hovered = signal<boolean>(false);
  menuOpened = signal<boolean>(false);
}
