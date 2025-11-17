import { Component, inject, input } from '@angular/core';
import { EditorComponent } from '../../../common/components/editor/editor.component';
import { FieldFormComponent } from '../field/field.form.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { ResumeFormService } from '../form.resume.service';
import { DateFormComponent } from '../date/date.form.component';

@Component({
  selector: 'section-item-form',
  imports: [
    EditorComponent,
    FieldFormComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    DateFormComponent,
  ],
  templateUrl: 'section-item.form.template.html',
})
export class SectionItemFormComponent {
  form = input.required<FormGroup>();
  service = inject(ResumeFormService);

  get title() {
    return this.form().get('title');
  }

  get subtext() {
    return this.form().get('subtext');
  }

  get right_subtext() {
    return this.form().get('right_subtext');
  }

  get date() {
    return this.form().get('date');
  }
}
