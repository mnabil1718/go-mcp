import { Component, ElementRef, inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { ResumeFormService } from '../form.resume.service';
import { ProfileFormComponent } from '../profile/profile.form.component';
import { SectionResumeFormComponent } from '../section/section.form.component';
import { TitleInputFormComponent } from '../title-input/title-input.form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ResumeDeleteDialogComponent } from '../../dialog/resume.delete.dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragHandleComponent } from '../../drag.handle.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'root-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    ProfileFormComponent,
    SectionResumeFormComponent,
    TitleInputFormComponent,
    MatIconModule,
    MatButtonModule,
    DragDropModule,
    DragHandleComponent,
    JsonPipe,
  ],
  templateUrl: 'root.form.template.html',
})
export class RootFormComponent {
  dialog = inject(MatDialog);
  service = inject(ResumeFormService);
  @ViewChildren('sections', { read: ElementRef }) sections!: QueryList<ElementRef>;

  scrollTo(element: Element | null) {
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  addSection(): void {
    this.service.addSection({
      id: crypto.randomUUID(),
      position: this.service.sections.length + 1,
      title: 'New Section',
      section_items: [],
    });

    setTimeout(() => {
      const last = this.sections.last;
      if (last) this.scrollTo(last.nativeElement);
    });
  }

  onDelete(e: Event, idx: number): void {
    e.stopPropagation();

    const ref = this.dialog.open(ResumeDeleteDialogComponent, {
      data: { type: 'section' },
      maxWidth: '400px',
      width: '100%',
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      if (confirmed) {
        this.service.removeSectionAt(idx);
      }
    });
  }

  onDrop(event: CdkDragDrop<AbstractControl[]>) {
    const arr = this.service.sections;

    moveItemInArray(arr.controls, event.previousIndex, event.currentIndex);

    arr.updateValueAndValidity();
  }
}
