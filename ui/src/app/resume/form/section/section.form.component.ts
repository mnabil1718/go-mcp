import {
  Component,
  ElementRef,
  inject,
  input,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
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
import { MatDialog } from '@angular/material/dialog';
import { ResumeDeleteDialogComponent } from '../../dialog/resume.delete.dialog.component';
import {
  CdkDragDrop,
  CdkDragEnter,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DragHandleComponent } from '../../drag.handle.component';

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
    DragDropModule,
    DragHandleComponent,
  ],
  templateUrl: 'section.form.template.html',
})
export class SectionResumeFormComponent {
  dialog = inject(MatDialog);
  idx = input.required<number>(); // track parent section id for drop list connection
  form = input.required<FormGroup>();
  service = inject(ResumeFormService);
  showContent = signal<boolean>(false);
  @ViewChildren('sectionItems', { read: ElementRef }) sectionItems!: QueryList<ElementRef>;

  get title() {
    return this.form().get('title');
  }

  get content() {
    return this.form().get('content');
  }

  get section_items() {
    return this.form().get('section_items') as FormArray;
  }

  get container_idx_list(): string[] {
    return this.service.sections.controls.map((_, idx) => `section-item-${idx}`);
  }

  addSectionItem(): void {
    this.service.addSectionItem(
      {
        id: crypto.randomUUID(),
        position: this.section_items.length + 1,
        title: 'New Section Item',
        subtext: 'Good Company, Inc.',
        right_subtext: 'San Francisco, CA',
      },
      this.section_items
    );

    setTimeout(() => {
      const last = this.sectionItems.last;
      if (last) this.scrollTo(last.nativeElement);
    });
  }

  scrollTo(element: Element | null) {
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  onDelete(e: Event, idx: number) {
    e.stopPropagation();

    const ref = this.dialog.open(ResumeDeleteDialogComponent, {
      data: { type: 'section_item' },
      maxWidth: '400px',
      width: '100%',
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      if (confirmed) {
        this.service.removeSectionItemAt(this.section_items, idx);
      }
    });
  }

  onDrop(event: CdkDragDrop<AbstractControl[]>) {
    const prevList = event.previousContainer.data as AbstractControl[];
    const currList = event.container.data as AbstractControl[];

    if (event.previousContainer === event.container) {
      // same section
      moveItemInArray(currList, event.previousIndex, event.currentIndex);
    } else {
      // different section, transfer
      transferArrayItem(prevList, currList, event.previousIndex, event.currentIndex);
    }

    (event.previousContainer.data as any).updateValueAndValidity?.();
    (event.container.data as any).updateValueAndValidity?.();
  }

  onDragOver(e: Event): void {
    console.log('dragged over');
  }
}
