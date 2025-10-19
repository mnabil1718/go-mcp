import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { ChatService } from '../chat.service';
import { catchError, exhaustMap, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { ChatActions, ChatAPIActions } from './chat.action';
import { ToastService } from '../../common/toast/toast.service';
import { Message, OllamaMessage } from '../../message/message.domain';
import { isOllamaMessage } from '../../common/helpers/object';
import * as ChatSelectors from './chat.selector';
import { Router } from '@angular/router';

@Injectable()
export class ChatsEffect {
  private actions$ = inject(Actions);
  private service = inject(ChatService);
  private toast = inject(ToastService);
  private router = inject(Router);

  ngrxOnInitEffects(): Action {
    return ChatActions.getChats();
  }

  getChats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.getChats),
      exhaustMap(() =>
        this.service.getChats().pipe(
          map((chats) => ChatAPIActions.getChatsSuccess({ chats })),
          catchError((error) => of(ChatAPIActions.failure({ message: error })))
        )
      )
    );
  });

  createOptimistic$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.createOptimistic),
      exhaustMap((action) =>
        this.service.create().pipe(
          mergeMap((ch) => [
            ChatAPIActions.createOptimisticSuccess({
              temp_id: action.temp_id,
              chat: ch,
            }),
            ChatActions.saveMessageFromCreate({
              temp_id: action.temp_id,
              chat_id: ch.id,
              message: action.prompt,
            }),
          ])
        )
      )
    );
  });

  saveMessageFromCreate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.saveMessageFromCreate),
      exhaustMap((action) =>
        this.service
          .saveMessage({
            chat_id: action.chat_id,
            message: action.message,
          })
          .pipe(
            mergeMap((msg) => [
              ChatAPIActions.saveMessageSuccess({ temp_id: action.temp_id, message: msg }),
              ChatActions.generateTitle({ id: action.chat_id }),
            ]),
            catchError((error) => of(ChatAPIActions.failure({ message: error })))
          )
      )
    );
  });

  generateTitle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.generateTitle),
      exhaustMap((action) =>
        this.service.generateTitle(action.id).pipe(
          mergeMap((chat) => [
            ChatAPIActions.generateTitleSuccess(chat),
            ChatActions.respond({ id: action.id, temp_id: crypto.randomUUID() }),
          ]),
          catchError((error) => of(ChatAPIActions.failure({ message: error })))
        )
      )
    );
  });

  navigateToChatAfterCreate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ChatAPIActions.createOptimisticSuccess),
        map((action) => {
          this.router.navigate(['/c', action.chat.id]);
        })
      ),
    { dispatch: false }
  );

  navigateAfterDelete$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ChatAPIActions.deleteSuccess),
        tap((action) => {
          const currChatId: string = this.router.url.split('/c/')[1];

          // if chat id to be deleted is the same as
          // current url chat id navigate to homepage
          if (currChatId == action.id) {
            this.router.navigate(['/']);
          }
        })
      ),
    { dispatch: false }
  );

  notifyAfterDelete$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ChatAPIActions.deleteSuccess),
        tap((_) => {
          this.toast.show('chat deleted successfully');
        })
      ),
    { dispatch: false }
  );

  getById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.getById),
      exhaustMap((action) =>
        this.service.getById(action.id).pipe(
          map((ch) => ChatAPIActions.getByIdSuccess(ch)),
          catchError((error) => of(ChatAPIActions.failure({ message: error })))
        )
      )
    );
  });

  sendOptimistic$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.sendOptimistic),
      exhaustMap((action) =>
        this.service
          .saveMessage({
            chat_id: action.chat_id,
            message: action.message,
          })
          .pipe(
            mergeMap((msg) => [
              ChatAPIActions.saveMessageSuccess({
                temp_id: action.temp_id,
                message: msg,
              }),
              ChatActions.respond({ id: action.chat_id, temp_id: crypto.randomUUID() }),
            ]),
            catchError((error) => of(ChatAPIActions.failure({ message: error })))
          )
      )
    );
  });

  rename$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.rename),
      // using switchMap to ignore previous
      // request in case of frequent user-retry
      switchMap((action) =>
        this.service
          .rename({
            chat_id: action.id,
            title: action.title,
          })
          .pipe(
            map((ch) => ChatAPIActions.renameSuccess(ch)),
            catchError((error) => of(ChatAPIActions.failure({ message: error })))
          )
      )
    );
  });

  respond$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.respond),
      exhaustMap((action) =>
        this.service.respond(action.id).pipe(
          map((data) => {
            {
              if (isOllamaMessage(data)) {
                return ChatAPIActions.respondStream({
                  chunk: data as OllamaMessage,
                  temp_id: action.temp_id,
                });
              }
              return ChatAPIActions.respondSuccess({
                message: data as Message,
                temp_id: action.temp_id,
              });
            }
          }),
          catchError((err) => of(ChatAPIActions.failure({ message: err })))
        )
      )
    )
  );

  delete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.delete),
      exhaustMap((action) =>
        this.service.delete(action.id).pipe(
          map((_) => ChatAPIActions.deleteSuccess({ id: action.id })),
          catchError((error) => of(ChatAPIActions.failure({ message: error })))
        )
      )
    );
  });

  displayError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ChatAPIActions.failure),
        map(({ message }) => {
          this.toast.showError(message);
        })
      ),
    { dispatch: false } // no action dispatched, purely side effect
  );
}
