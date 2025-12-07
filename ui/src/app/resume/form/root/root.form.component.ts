import { Component, ElementRef, inject, QueryList, viewChild, ViewChildren } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { ResumeFormService } from '../form.resume.service';
import { ProfileFormComponent } from '../profile/profile.form.component';
import { SectionResumeFormComponent } from '../section/section.form.component';
import { TitleInputFormComponent } from '../title-input/title-input.form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ResumeDeleteDialogComponent } from '../../dialog/resume.delete.dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  CdkDragDrop,
  CdkDragMove,
  CdkDragStart,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DragHandleComponent } from '../../drag.handle.component';
import { PointerPosition } from '../form.resume.domain';
import { MediaService } from '../../../common/media/media.service';
import { DeleteButtonComponent } from '../delete/delete-button.component';

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
    DeleteButtonComponent,
  ],
  templateUrl: 'root.form.template.html',
})
export class RootFormComponent {
  dialog = inject(MatDialog);
  service = inject(ResumeFormService);
  private media = inject(MediaService);
  accordion = viewChild.required(MatAccordion);
  isTablet = this.media.match('(max-width: 1024px)');
  boundsMemo: DOMRect[] = []; // cache bounding rects at drag start
  @ViewChildren('matSections') matSections!: QueryList<MatExpansionPanel>; //for automatic open
  @ViewChildren('sections', { read: ElementRef }) sections!: QueryList<ElementRef>; // for scroll

  private getPointerBoundsId(p: PointerPosition): number {
    for (let i = 0; i < this.boundsMemo.length; i++) {
      if (
        p.x >= this.boundsMemo[i].left &&
        p.x <= this.boundsMemo[i].right &&
        p.y >= this.boundsMemo[i].top &&
        p.y <= this.boundsMemo[i].bottom
      ) {
        return i;
      }
    }

    return -1;
  }

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

  childDragStart(_: CdkDragStart): void {
    this.boundsMemo = this.sections.map((s) => s.nativeElement.getBoundingClientRect());
  }

  childDragMoved(e: CdkDragMove): void {
    const p = e.pointerPosition;
    const id = this.getPointerBoundsId(p);

    if (id !== -1) {
      let panel = this.matSections.get(id);
      if (!panel?.expanded) panel?.open();
    }
  }
}
