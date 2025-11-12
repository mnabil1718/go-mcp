import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { ResumeFormService } from '../form.resume.service';
import { ProfileResumeFormComponent } from '../profile/profile.form.resume.component';

@Component({
  selector: 'root-resume-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    ProfileResumeFormComponent,
  ],
  templateUrl: 'root.form.resume.template.html',
})
export class RootResumeFormComponent {
  service = inject(ResumeFormService);
}
