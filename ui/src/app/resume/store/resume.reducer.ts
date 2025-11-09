import { createReducer, on } from '@ngrx/store';
import { ResumeState } from '../resume.domain';
import { ResumeActions, ResumeAPIActions } from './resume.action';

export const initState: ResumeState = {
  resumes: [],
  sections: [],
  section_items: [],
  selectedResumeId: null,
  loading: false,
};

export const resumesReducer = createReducer(
  initState,

  // User

  on(ResumeActions.create, (state, { temp_id }) => ({
    ...state,
    resumes: [
      {
        id: temp_id,
        title: 'My New Resume',
        created_at: new Date().toISOString(),
        children: [],
      },
      ...state.resumes,
    ],
    selectedResumeId: temp_id,
  })),

  // API

  on(ResumeAPIActions.createSuccess, (state, { temp_id, resume }) => ({
    ...state,
    selectedResumeId: resume.id,
    resumes: state.resumes.map((r) => (r.id === temp_id ? resume : r)),
  }))
);
