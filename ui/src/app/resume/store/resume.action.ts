import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Resume, ResumeNode } from '../resume.domain';

export const ResumeActions = createActionGroup({
  source: 'Resumes',
  events: {
    // user intent
    getResumes: emptyProps(),
    initCreate: props<{ temp_id: string }>(),
    rename: props<{ id: string; title: string }>(),
    create: props<{ temp_id: string; seed_tree: ResumeNode; resume: Resume }>(),
    getById: props<{ id: string }>(),
  },
});

export const ResumeAPIActions = createActionGroup({
  source: 'Resumes API',
  events: {
    // API result
    getResumesSuccess: props<{ resumes: Resume[] }>(),
    createSuccess: props<{ temp_id: string; resume: Resume }>(),
    getByIdSuccess: props<{ id: string; tree: ResumeNode }>(),
    renameSuccess: props<Resume>(),

    failure: props<{ error: Error }>(),
  },
});
