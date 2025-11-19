import { Component, inject, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { AppToolbarComponent } from '../../components/toolbar/app.toolbar.component';
import { SidenavService } from '../../components/sidenav/sidenav.service';
import { RootLayoutComponent } from '../root/root.layout.component';

@Component({
  selector: 'main-layout',
  imports: [RouterOutlet, MatToolbarModule, AppToolbarComponent, RootLayoutComponent],
  templateUrl: 'main.layout.template.html',
})
export class MainLayoutComponent {}
