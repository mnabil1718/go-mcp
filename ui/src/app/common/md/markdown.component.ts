import { Component, input, viewChild, ElementRef, effect } from '@angular/core';
import { marked } from 'marked';

@Component({
  selector: 'markdown',
  template: `<div #md class="w-full "></div>`,
})
export class MarkdownComponent {
  content = input.required<string | null>();
  stream = input<boolean>(false);

  container = viewChild.required<ElementRef<HTMLDivElement>>('md');

  constructor() {
    effect(async () => {
      const el = this.container();
      const content = this.content();
      if (!el || !content) return;

      el.nativeElement.innerHTML = await marked.parse(content);
    });
  }
}
