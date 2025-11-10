import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { errorResponseInterceptor, retryInterceptor } from './common/api/api.interceptor';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { chatsReducer } from './chat/store/chat.reducer';
import { ChatsEffect } from './chat/store/chat.effect';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { resumesReducer } from './resume/store/resume.reducer';
import { ResumeEffect } from './resume/store/resume.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([retryInterceptor, errorResponseInterceptor])),
    provideStore(),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),
    provideState({ name: 'chat', reducer: chatsReducer }),
    provideState({ name: 'resume', reducer: resumesReducer }),
    provideEffects([ChatsEffect, ResumeEffect]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
