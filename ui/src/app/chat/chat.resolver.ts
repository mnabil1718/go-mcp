import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import * as ChatSelectors from './store/chat.selector';
import { firstValueFrom } from 'rxjs';
import { ChatActions } from './store/chat.action';

export const ChatResolver: ResolveFn<boolean> = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store = inject(Store);
  const id = route.paramMap.get('id');
  const currentId = await firstValueFrom(store.select(ChatSelectors.selectSelectedChatId));

  if (id && currentId !== id) {
    store.dispatch(ChatActions.getById({ id }));
  }

  return true;
};
