import { Component, input, viewChild, ElementRef, effect, inject } from '@angular/core';
import { MarkdownService } from './markdown.service';

@Component({
  selector: 'markdown',
  template: `<div #md class="max-w-full p-3 whitespace-pre-line"></div>`,
})
export class MarkdownComponent {
  content = input.required<string>();
  private md = inject(MarkdownService);
  container = viewChild.required<ElementRef<HTMLDivElement>>('md');

  private onContentChanged = effect(async () => {
    const el = this.container();
    const content = this.content();
    if (!el || !content) return;

    el.nativeElement.innerHTML = await this.md.parse(content);
  });
}
