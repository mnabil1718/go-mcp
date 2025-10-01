import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MediaService } from './common/media/media.service';
import { SidenavComponent } from './common/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatIcon,
    MatButtonModule,
    RouterLink,
    SidenavComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ui');

  private media = inject(MediaService);
  isMobile = this.media.match('(max-width: 600px)');
}
