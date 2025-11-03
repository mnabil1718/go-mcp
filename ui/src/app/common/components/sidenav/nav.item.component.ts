import { Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive, UrlTree } from '@angular/router';
import { SidenavItemMenu } from './sidenav.domain';
import { MediaService } from '../../media/media.service';

@Component({
  selector: 'nav-item',
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
      } @if (itemMenuLength() > 0) {
      <!-- click without navigate, use $event.stopPropagation() -->
      <div matListItemMeta class="right-0 !mr-1 ">
        @if (showMenuButtonOnDesktop() || showMenuButtonOnTablet()) {
        <button
          matIconButton
          [matMenuTriggerFor]="menu"
          (menuOpened)="menuOpened.set(true)"
          (menuClosed)="menuOpened.set(false)"
          (click)="$event.stopPropagation()"
          class="cursor-pointer flex items-center"
        >
          <mat-icon>more_horiz</mat-icon>
        </button>
        }

        <!-- Dropdown Menu -->
        <mat-menu #menu="matMenu">
          @for (item of itemMenu(); track $index) {
          <button (click)="item.actionCallback()" mat-menu-item>{{ item.label }}</button>
          }
        </mat-menu>
      </div>
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

  private media = inject(MediaService);

  isTablet = this.media.match('(max-width: 1024px)');

  hovered = signal<boolean>(false);
  menuOpened = signal<boolean>(false);

  showMenuButtonOnDesktop(): boolean {
    return !this.isTablet() && (this.hovered() || this.menuOpened());
  }

  showMenuButtonOnTablet(): boolean {
    return this.isTablet();
  }
}
