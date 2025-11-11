import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ResumeSelectors from './store/resume.selector';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, map, take } from 'rxjs';
import { ResumeActions } from './store/resume.action';

export const ResumeResolver: ResolveFn<boolean> = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot
) => {
  const store = inject(Store);
  const id = route.paramMap.get('id');
  const currentSelectedId = await firstValueFrom(
    store.select(ResumeSelectors.selectSelectedResumeId)
  );

  if (id && id !== currentSelectedId) {
    store.dispatch(ResumeActions.getById({ id }));
  }

  return true;
};

export const ResumeTitleResolver: ResolveFn<string> = (route) => {
  const store = inject(Store);
  const id = route.paramMap.get('id') ?? '';

  return store.select(ResumeSelectors.selectResumeTitle(id)).pipe(
    take(1),
    map((title) => title ?? 'Jahri.ai - My New Resume')
  );
};
