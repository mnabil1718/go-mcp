import { Component, computed, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as ChatSelectors from '../../../chat/store/chat.selector';
import * as ResumeSelectors from '../../../resume/store/resume.selector';

@Component({
  selector: 'navigation-loading',
  imports: [MatProgressBarModule],
  template: `
    <div class="fixed top-0 w-full z-10">
      @if (loading()) {
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      }
    </div>
  `,
})
export class NavigationLoadingComponent {
  private store = inject(Store);
  private router = inject(Router);
  readonly chatStoreLoading = toSignal(this.store.select(ChatSelectors.selectLoading));
  readonly resumeStoreLoading = toSignal(this.store.select(ResumeSelectors.selectResumeLoading));
  readonly loading = computed(
    () => !!this.router.currentNavigation() || this.chatStoreLoading() || this.resumeStoreLoading()
  );
}
