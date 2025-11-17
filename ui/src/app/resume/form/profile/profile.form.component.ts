import { Component, inject, input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ResumeFormService } from '../form.resume.service';
import { EditorComponent } from '../../../common/components/editor/editor.component';
import { FileInputComponent } from '../../../common/components/file/input.file.component';
import { FieldFormComponent } from '../field/field.form.component';

@Component({
  selector: 'profile-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    EditorComponent,
    FileInputComponent,
    FieldFormComponent,
  ],
  styles: `
  `,
  templateUrl: 'profile.form.template.html',
})
export class ProfileFormComponent {
  form = input.required<FormGroup>();
  service = inject(ResumeFormService);

  get photo_url() {
    return this.form().get('photo_url');
  }

  get name() {
    return this.form().get('name');
  }

  get content() {
    return this.form().get('content');
  }
}
