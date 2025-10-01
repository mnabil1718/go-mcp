import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import * as ChatSelectors from './store/chat.selector';
import { firstValueFrom, map, take, tap } from 'rxjs';
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

export const ChatTitleResolver: ResolveFn<string> = (route) => {
  const store = inject(Store);
  const chatId = route.paramMap.get('id');

  return store.select(ChatSelectors.selectChats).pipe(
    map((chats) => {
      const chat = chats.find((c) => c.id === chatId);
      return chat && chat.title ? chat.title : 'Jahri.ai - New Chat';
    }),
    take(1)
  );
};
