import { Store } from '@ngrx/store';
import { Component, inject } from '@angular/core';
import * as ResumeSelectors from '../store/resume.selector';
import { ResumeFormService } from './form.resume.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: `resume-form`,
  template: ` <p>{{ this.service.formGroup.get('title')?.value }}</p>`,
})
export class ResumeFormComponent {
  store = inject(Store);
  service = inject(ResumeFormService);
  selectedTree$ = this.store.select(ResumeSelectors.selectSelectedResumeTree);

  async ngOnInit() {
    this.service.formGroup = await firstValueFrom(this.selectedTree$);
  }
}
