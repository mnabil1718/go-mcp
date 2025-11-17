import { Component, inject } from '@angular/core';
import { ResumeFormService } from './form.resume.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RootFormComponent } from './root/root.form.component';

@Component({
  selector: `resume-form`,
  imports: [ReactiveFormsModule, RootFormComponent],
  templateUrl: 'form.resume.template.html',
})
export class ResumeFormComponent {
  service = inject(ResumeFormService);
}
