import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { ResumeToolbarComponent } from '../../components/toolbar/resume.toolbar.component';
import { RootLayoutComponent } from '../root/root.layout.component';

@Component({
  selector: 'resume-layout',
  imports: [RouterOutlet, MatToolbarModule, ResumeToolbarComponent, RootLayoutComponent],
  templateUrl: 'resume.layout.template.html',
})
export class ResumeLayoutComponent {}
