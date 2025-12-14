import { Component, computed, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavService } from '../sidenav/sidenav.service';
import { MatButtonModule } from '@angular/material/button';
import { PDFService } from '../../pdf/pdf.service';
import * as ResumeSelectors from '../../../resume/store/resume.selector';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ResumeActions } from '../../../resume/store/resume.action';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'resume-toolbar',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
  ],
  template: `
    <mat-toolbar class="sticky z-50 top-0 border-b border-slate-300">
      <button matIconButton class="mr-2" (click)="sidenavToggle()">
        <mat-icon fontSet="material-symbols-outlined">side_navigation</mat-icon>
      </button>
      <input
        #input
        matInput
        [value]="title()"
        (blur)="onBlur()"
        (focus)="onFocus()"
        (keydown)="onKeyDown($event)"
        placeholder="Insert Resume Title..."
        (input)="title.set($any($event.target).value)"
        class="w-full outline-0 placeholder:text-slate-400 mr-3"
      />
      <button matButton="filled" (click)="generatePDF()">
        <mat-icon fontSet="material-symbols-outlined">export_notes</mat-icon>
        Export PDF
      </button>
    </mat-toolbar>
  `,
})
export class ResumeToolbarComponent {
  private store = inject(Store);
  sidenavService = inject(SidenavService);
  pdfService = inject(PDFService);
  readonly resume = toSignal(this.store.select(ResumeSelectors.selectSelectedResume), {
    initialValue: null,
  });
  title = signal<string>(''); // writable signal
  originalTitle = signal<string>(''); // writable signal
  readonly id = computed(() => this.resume()?.id ?? null);

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  constructor() {
    effect(() => {
      const r = this.resume();
      if (!r) return;

      this.title.set(r.title);
      this.originalTitle.set(r.title);
    });
  }

  sidenavToggle() {
    this.sidenavService.toggle();
  }

  generatePDF() {
    this.pdfService.generate();
  }

  dispatch() {
    const id = this.id();
    const title = this.title().trim();
    const oldTitle = this.originalTitle().trim();

    if (!id || title == '' || oldTitle === title) return;

    this.store.dispatch(ResumeActions.rename({ id, title }));
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.dispatch();
      this.input.nativeElement.blur();
    }
  }

  onFocus(): void {
    const el = this.input.nativeElement;

    queueMicrotask(() => {
      el.setSelectionRange(0, el.value.length);
    });
  }

  onBlur(): void {
    this.dispatch();
  }
}
