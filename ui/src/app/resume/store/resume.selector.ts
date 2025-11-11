import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ResumeState } from '../resume.domain';

export const selectResumeState = createFeatureSelector<ResumeState>('resume');
export const selectResumes = createSelector(selectResumeState, (state) => state.resumes);
export const selectSelectedResumeId = createSelector(
  selectResumeState,
  (state) => state.selectedId
);
export const selectResumeLoading = createSelector(selectResumeState, (state) => state.loading);
export const selectSelectedResumeTree = createSelector(
  selectResumeState,
  (state) => state.selectedTree
);

export const selectResumeTitle = (id: string) =>
  createSelector(selectResumes, (resumes) => {
    for (const r of resumes) {
      if (r.id === id) {
        return r.title;
      }
    }

    return null;
  });
