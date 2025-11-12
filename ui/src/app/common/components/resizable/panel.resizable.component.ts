import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, input, signal } from '@angular/core';
import { CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import { MediaService } from '../../media/media.service';

@Component({
  selector: 'resizable-panel',
  imports: [CommonModule, DragDropModule],
  styles: `
  .bg-surface {
  background-color: var(--mat-sys-surface);
}
  `,
  template: `
    <div class="overflow-auto h-full w-full">
      <ng-content />
    </div>

    @if (!isTablet()) {
    <div
      cdkDrag
      (cdkDragStarted)="onDragStarted()"
      (cdkDragEnded)="onDragFinished()"
      (cdkDragMoved)="onDragMoved($event)"
      [class.cursor-ew-resize]="isDragging()"
      [class.bg-blue-500]="isDragging()"
      [class.bg-transparent]="!isDragging()"
      (dblclick)="onDoubleClick()"
      [class.left-0]="position() === 'right'"
      [class.right-0]="position() === 'left'"
      class="absolute flex top-0 inset-y-0 justify-center items-center w-1 transition-colors duration-200 group hover:bg-blue-500 hover:cursor-ew-resize"
    >
      <span
        [class.bg-blue-500]="isDragging()"
        [class.text-white]="isDragging()"
        [class.bg-white]="!isDragging()"
        class=" text-slate-400 group-hover:text-white group-hover:bg-blue-500 rounded-lg transition-colors duration-200"
        >⠿</span
      >
    </div>
    }
  `,
  host: {
    class: 'relative block',
    '[class.border-l]': '!isTablet()',
    '[class.border-slate-300]': '!isTablet()',
    '[style.width.px]': 'isTablet() ? parentWidth() : currentWidth()',
  },
})
export class ResizablePanel {
  private media = inject(MediaService);
  private ref = inject(ElementRef<HTMLElement>);
  isTablet = this.media.match('(max-width: 1024px)');

  position = input<'left' | 'right'>('left');
  currentWidth = signal<number>(0);
  isDragging = signal<boolean>(false);
  minWidth = input.required<number>();
  defaultWidth = input.required<number>();
  parentWidth = input.required<number>();

  onDefaultWidthChanged = effect(() => {
    this.currentWidth.set(this.defaultWidth());
  });

  onDoubleClick() {
    this.currentWidth.set(this.defaultWidth());
  }

  onDragStarted(): void {
    this.isDragging.set(true);
    document.body.classList.add('cursor-ew-resize');
  }

  onDragFinished(): void {
    this.isDragging.set(false);
    document.body.classList.remove('cursor-ew-resize');
  }

  onDragMoved(e: CdkDragMove): void {
    const p = this.position();
    const min = this.minWidth();
    const max = this.defaultWidth();
    const rectBound = this.ref.nativeElement.getBoundingClientRect();
    var w = e.pointerPosition.x;

    if (p === 'right') {
      w = rectBound.right - w;
    }

    if (w >= min && w <= max) {
      this.currentWidth.set(w);
    }

    // Reset transform so the resizer stays positioned at the sidebar edge
    const el = e.source.element.nativeElement;
    el.style.transform = 'none';
  }
}
