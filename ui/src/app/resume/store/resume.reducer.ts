import { createReducer, on } from '@ngrx/store';
import { ResumeState } from '../resume.domain';
import { ResumeActions, ResumeAPIActions } from './resume.action';

export const initState: ResumeState = {
  resumes: [],
  selectedId: null,
  selectedTree: null,
  loading: false,
};

export const resumesReducer = createReducer(
  initState,

  // User

  on(ResumeActions.initCreate, (state, _) => ({
    ...state,
    loading: true,
  })),

  on(ResumeActions.create, (state, { temp_id, seed_tree, resume }) => ({
    ...state,
    resumes: [resume, ...state.resumes],
    selectedResumeId: temp_id,
    selectedTree: seed_tree,
  })),

  on(ResumeActions.getById, (state, _) => ({
    ...state,
    loading: true,
  })),

  // API

  on(ResumeAPIActions.createSuccess, (state, { temp_id, resume }) => ({
    ...state,
    loading: false,
    selectedId: resume.id,
    resumes: state.resumes.map((r) => (r.id === temp_id ? resume : r)),
    selectedTree: state.selectedTree ? { ...state.selectedTree, id: resume.id } : null,
  })),

  on(ResumeAPIActions.getByIdSuccess, (state, { tree }) => ({
    ...state,
    loading: false,
    selectedId: tree.id,
    selectedTree: tree,
  }))
);
