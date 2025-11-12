import { Component, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ResumeFormService } from '../form.resume.service';

@Component({
  selector: 'profile-resume-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatExpansionModule],
  templateUrl: 'profile.form.resume.template.html',
})
export class ProfileResumeFormComponent {
  form = input.required<FormGroup>();
  service = inject(ResumeFormService);
}
