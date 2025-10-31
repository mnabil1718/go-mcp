import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ResumeItemCardComponent } from '../item.resume.component';

@Component({
  selector: 'resume-index-component',
  imports: [MatCardModule, MatButtonModule, MatIconModule, ResumeItemCardComponent],
  templateUrl: 'index.resume.template.html',
  host: {
    class: 'flex flex-col flex-1 justify-start items-center p-5',
  },
})
export class ResumeIndexComponent {}
