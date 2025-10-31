import { Component, inject, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { SidenavService } from '../sidenav/sidenav.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, MatIconModule, RouterLink, MatButtonModule],
  template: `
    <mat-toolbar class="sticky z-50 top-0 border-b border-slate-300">
      <button matIconButton class="mr-2" (click)="sidenavToggle()">
        <mat-icon fontSet="material-symbols-outlined">side_navigation</mat-icon>
      </button>
      <a routerLink="/">Jahri.ai</a>
    </mat-toolbar>
  `,
})
export class AppToolbarComponent {
  sidenavService = inject(SidenavService);

  sidenavToggle() {
    this.sidenavService.toggle();
  }
}
