import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ResumeService } from '../resume.service';
import { ToastService } from '../../common/toast/toast.service';
import { Router } from '@angular/router';
import { ResumeActions, ResumeAPIActions } from './resume.action';
import { exhaustMap, map, of } from 'rxjs';
import { buildSeedTree } from '../resume.data';
import { Resume, ResumeNode } from '../resume.domain';
import { ResumeFormService } from '../form/form.resume.service';

@Injectable()
export class ResumeEffect {
  private actions$ = inject(Actions);
  private service = inject(ResumeService);
  private formService = inject(ResumeFormService);
  private toast = inject(ToastService);
  private router = inject(Router);

  initCreate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ResumeActions.initCreate),
      exhaustMap(({ temp_id }) => {
        const seed_tree: ResumeNode = buildSeedTree(temp_id);
        const resume = this.service.treeToResume(seed_tree);
        this.formService.form = seed_tree;
        return of(ResumeActions.create({ temp_id, seed_tree, resume }));
      })
    );
  });

  create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ResumeActions.create),
      exhaustMap(({ temp_id }) => {
        const dummy: Resume = {
          id: crypto.randomUUID(),
          title: 'Dummy Resume',
          created_at: new Date().toISOString(),
        };
        return of(ResumeAPIActions.createSuccess({ temp_id, resume: dummy }));
      })
    );
  });

  navigateToEditorAfterCreate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ResumeAPIActions.createSuccess),
        map(({ resume }) => {
          this.router.navigate(['/r', resume.id]);
        })
      ),
    { dispatch: false }
  );
}
