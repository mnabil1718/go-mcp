import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { AppToolbarComponent } from '../../components/toolbar/app.toolbar.component';
import { SidenavService } from '../../components/sidenav/sidenav.service';

@Component({
  selector: 'main-layout',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    SidenavComponent,
    AppToolbarComponent,
  ],
  templateUrl: 'main.layout.template.html',
})
export class MainLayoutComponent {
  sidenavService = inject(SidenavService);
  @ViewChild('sidenav') sidenav!: MatSidenav;

  ngOnInit() {
    this.sidenavService.toggle$.subscribe(() => {
      this.sidenav.toggle();
    });
  }
}
