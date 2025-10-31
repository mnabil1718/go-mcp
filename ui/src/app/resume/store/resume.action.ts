import { createActionGroup, props } from '@ngrx/store';
import { Resume } from '../resume.domain';

export const ResumeActions = createActionGroup({
  source: 'Resumes',
  events: {
    // user intent
    create: props<{ temp_id: string }>(),
  },
});

export const ResumeAPIActions = createActionGroup({
  source: 'Resumes API',
  events: {
    // API result
    createSuccess: props<{ temp_id: string; resume: Resume }>(),

    failure: props<{ error: Error }>(),
  },
});
