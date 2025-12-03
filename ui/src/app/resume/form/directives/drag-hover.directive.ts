import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[dragHoverOpen]',
})
export class DragHoverOpenDirective implements OnInit {
  @Input('dragHoverOpen') drag?: CdkDrag; // (optional)
  private dragging = false;

  constructor(private el: ElementRef, private panel: MatExpansionPanel) {}

  ngOnInit() {
    // track dragging globally
    fromEvent<DragEvent>(document, 'dragstart').subscribe(() => (this.dragging = true));
    fromEvent<DragEvent>(document, 'dragend').subscribe(() => (this.dragging = false));

    // mouse move polling
    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(filter(() => this.dragging))
      .subscribe((e) => this.checkHover(e));
  }

  private checkHover(e: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (inside && !this.panel.expanded) {
      this.panel.open(); // auto-open
    }
  }
}
