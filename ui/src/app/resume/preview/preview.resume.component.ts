import { Component, inject } from '@angular/core';
import { ResumeFormService } from '../form/form.resume.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'preview-resume',
  imports: [AsyncPipe],
  templateUrl: 'preview.resume.template.html',
  styleUrl: 'preview.resume.css',
  host: {
    class: 'hidden md:flex w-full min-h-0 preview-container overflow-y-auto p-2',
  },
})
export class PreviewResumeComponent {
  formService = inject(ResumeFormService);
  data$ = this.formService.value$;

  normalizeHtml(html?: string): string {
    return html?.replace(/&nbsp;/g, ' ') ?? '';
  }

  valueNotEmpty(value?: string): boolean {
    if (!value) return false;
    return value.trim().length > 0;
  }
}
