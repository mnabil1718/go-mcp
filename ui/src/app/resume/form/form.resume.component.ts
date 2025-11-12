import { Component, inject } from '@angular/core';
import { ResumeFormService } from './form.resume.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RootResumeFormComponent } from './root/root.form.resume.component';

@Component({
  selector: `resume-form`,
  imports: [ReactiveFormsModule, RootResumeFormComponent],
  templateUrl: 'form.resume.template.html',
})
export class ResumeFormComponent {
  service = inject(ResumeFormService);
}
