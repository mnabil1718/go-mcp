import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { SidenavService } from '../../components/sidenav/sidenav.service';
import { ResumeToolbarComponent } from '../../components/toolbar/resume.toolbar.component';

@Component({
  selector: 'resume-layout',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    SidenavComponent,
    ResumeToolbarComponent,
  ],
  templateUrl: 'resume.layout.template.html',
})
export class ResumeLayoutComponent {
  sidenavService = inject(SidenavService);
  @ViewChild('sidenav') sidenav!: MatSidenav;

  ngOnInit() {
    this.sidenavService.toggle$.subscribe(() => {
      this.sidenav.toggle();
    });
  }
}
