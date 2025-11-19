import { Component, inject, input, signal } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { FieldFormComponent } from '../field/field.form.component';
import { EditorComponent } from '../../../common/components/editor/editor.component';
import { ResumeFormService } from '../form.resume.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SectionItemFormComponent } from '../section-item/section-item.form.component';
import { TitleInputFormComponent } from '../title-input/title-input.form.component';

@Component({
  selector: 'section-form',
  imports: [
    EditorComponent,
    FieldFormComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    MatSlideToggleModule,
    SectionItemFormComponent,
    TitleInputFormComponent,
  ],
  templateUrl: 'section.form.template.html',
})
export class SectionResumeFormComponent {
  form = input.required<FormGroup>();
  service = inject(ResumeFormService);
  showContent = signal<boolean>(false);

  get title() {
    return this.form().get('title');
  }

  get content() {
    return this.form().get('content');
  }

  get section_items() {
    return this.form().get('section_items') as FormArray;
  }

  addSectionItem(): void {
    this.section_items.push(
      this.service.buildSectionItemGroup({
        id: crypto.randomUUID(),
        position: this.section_items.length + 1,
        title: 'New Section Item',
        subtext: 'Good Company, Inc.',
        right_subtext: 'San Francisco, CA',
      })
    );
  }
}
