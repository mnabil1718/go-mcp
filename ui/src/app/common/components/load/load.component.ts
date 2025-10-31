import { Component, computed, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as ChatSelectors from '../../../chat/store/chat.selector';

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
  readonly storeLoading = toSignal(this.store.select(ChatSelectors.selectLoading));
  readonly loading = computed(() => !!this.router.currentNavigation() || this.storeLoading());
}
