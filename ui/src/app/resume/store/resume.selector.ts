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

export const selectSelectedResume = createSelector(
  selectResumes,
  selectSelectedResumeId,
  (resumes, selectedId) => resumes.find((r) => r.id === selectedId) // get selected resume from resumes, not resume tree
);

// for resolver
export const selectResumeTitle = (id: string) =>
  createSelector(selectResumes, (resumes) => {
    for (const r of resumes) {
      if (r.id === id) {
        return r.title;
      }
    }

    return null;
  });
