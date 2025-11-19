import { Component, inject, ViewChild } from '@angular/core';
import { SidenavService } from '../../components/sidenav/sidenav.service';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { ResumeToolbarComponent } from '../../components/toolbar/resume.toolbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'root-layout',
  templateUrl: 'root.layout.template.html',
  imports: [MatSidenavModule, SidenavComponent],
})
export class RootLayoutComponent {
  sidenavService = inject(SidenavService);
  @ViewChild('sidenav') sidenav!: MatSidenav;

  ngOnInit() {
    this.sidenavService.toggle$.subscribe(() => {
      this.sidenav.toggle();
    });
  }
}
