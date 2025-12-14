import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, input, signal } from '@angular/core';
import { CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import { MediaService } from '../../media/media.service';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'resizable-panel',
  imports: [CommonModule, DragDropModule, CdkScrollable],
  styles: `
  .bg-surface {
    background-color: var(--mat-sys-surface);
  }
  `,
  template: `
    <div cdkScrollable class="overflow-auto h-full w-full">
      <ng-content />
    </div>

    @if (!isTablet()) {
    <div
      cdkDrag
      cdkDragLockAxis="x"
      (cdkDragStarted)="onDragStarted($event)"
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
        class="text-slate-400 group-hover:text-white group-hover:bg-blue-500 rounded-lg transition-colors duration-200"
      >
        ⠿
      </span>
    </div>
    }
  `,
  host: {
    class: 'relative block',
    '[class.border-l]': '!isTablet() && position() === "right"',
    '[class.border-r]': '!isTablet() && position() === "left"',
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

  // ✅ added
  private startX = 0;
  private startWidth = 0;

  onDefaultWidthChanged = effect(() => {
    this.currentWidth.set(this.defaultWidth());
  });

  onDoubleClick() {
    this.currentWidth.set(this.defaultWidth());
  }

  // ✅ fixed
  onDragStarted(e: any): void {
    this.isDragging.set(true);
    document.body.classList.add('cursor-ew-resize');

    this.startX = e.event.clientX;
    this.startWidth = this.currentWidth();
  }

  onDragFinished(): void {
    this.isDragging.set(false);
    document.body.classList.remove('cursor-ew-resize');
  }

  // ✅ fixed
  onDragMoved(e: CdkDragMove): void {
    const min = this.minWidth();
    const max = this.defaultWidth();

    const deltaX = e.pointerPosition.x - this.startX;

    let w = this.position() === 'left' ? this.startWidth + deltaX : this.startWidth - deltaX;

    w = Math.max(min, Math.min(max, w));
    this.currentWidth.set(w);

    // keep handle fixed
    e.source.element.nativeElement.style.transform = 'none';
  }
}
