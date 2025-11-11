import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ResumeCardComponent } from '../card.resume.component';

@Component({
  selector: 'resume-index',
  imports: [MatCardModule, MatButtonModule, MatIconModule, ResumeCardComponent],
  templateUrl: 'index.resume.template.html',
  host: {
    class: 'flex flex-col flex-1 justify-start items-center p-5',
  },
})
export class IndexResumeComponent {}
