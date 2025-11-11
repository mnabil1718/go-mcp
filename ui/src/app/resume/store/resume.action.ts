import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Resume, ResumeNode } from '../resume.domain';

export const ResumeActions = createActionGroup({
  source: 'Resumes',
  events: {
    // user intent
    initCreate: props<{ temp_id: string }>(),
    create: props<{ temp_id: string; seed_tree: ResumeNode; resume: Resume }>(),
    getById: props<{ id: string }>(),
  },
});

export const ResumeAPIActions = createActionGroup({
  source: 'Resumes API',
  events: {
    // API result
    createSuccess: props<{ temp_id: string; resume: Resume }>(),
    getByIdSuccess: props<{ tree: ResumeNode }>(),

    failure: props<{ error: Error }>(),
  },
});
