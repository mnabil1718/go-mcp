import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { ResumeFormService } from '../form.resume.service';
import { ProfileFormComponent } from '../profile/profile.form.component';
import { SectionResumeFormComponent } from '../section/section.form.component';

@Component({
  selector: 'root-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    ProfileFormComponent,
    SectionResumeFormComponent,
  ],
  templateUrl: 'root.form.template.html',
})
export class RootFormComponent {
  service = inject(ResumeFormService);
}
