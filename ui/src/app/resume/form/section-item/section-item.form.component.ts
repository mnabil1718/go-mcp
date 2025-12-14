import { Component, inject, input, signal } from '@angular/core';
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
import { DATE_DISPLAY_FORMAT } from '../../../common/date/date.domain';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { ResumeDeleteDialogComponent } from '../../dialog/resume.delete.dialog.component';
import { NEW_DATE } from '../../resume.data';

@Component({
  selector: 'section-item-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    DateFormComponent,
    MatSlideToggleModule,
    FieldFormComponent,
    EditorComponent,
  ],
  templateUrl: 'section-item.form.template.html',
})
export class SectionItemFormComponent {
  dialog = inject(MatDialog);
  form = input.required<FormGroup>();
  service = inject(ResumeFormService);
  showContent = signal<boolean>(false);

  get title() {
    return this.form().get('title');
  }

  get subtext() {
    return this.form().get('subtext');
  }

  get right_subtext() {
    return this.form().get('right_subtext');
  }

  get content() {
    return this.form().get('content');
  }

  get date() {
    return this.form().get('date');
  }

  addDate(): void {
    const fg = this.service.buildDateGroup(NEW_DATE);
    this.form().setControl('date', fg);
  }

  onDeleteDate(e: Event): void {
    e.stopPropagation();

    const ref = this.dialog.open(ResumeDeleteDialogComponent, {
      data: { type: 'date' },
      maxWidth: '400px',
      width: '100%',
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      if (confirmed) {
        this.form().setControl('date', null);
      }
    });
  }
}
