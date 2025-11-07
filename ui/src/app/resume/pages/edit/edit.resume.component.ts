import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ResizablePanel } from '../../../common/components/resizable/panel.resizable.component';

@Component({
  selector: 'edit-resume',
  imports: [ResizablePanel],
  templateUrl: 'edit.resume.template.html',
  styleUrl: 'edit.resume.css',
  host: {
    class: 'flex flex-col flex-1 min-h-0 w-full',
  },
})
export class EditResumeComponent {
  private ro!: ResizeObserver;
  width = signal<number>(1175); // magic number
  private ref = inject(ElementRef<HTMLElement>);
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLElement>;

  constructor() {
    this.ro = new ResizeObserver((s) => {
      // if 1 element is observed,
      // then it only iterates once
      for (const e of s) {
        this.width.set(e.contentRect.width);
      }
    });
  }

  ngOnInit(): void {
    this.ro.observe(this.ref.nativeElement);
  }

  onOnDestroy(): void {
    this.ro.disconnect();
  }
}
