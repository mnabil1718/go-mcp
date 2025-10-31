import { Injectable, OnDestroy, signal, WritableSignal, inject, Signal } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

/**
 * Singleton MediaQuery service for the entire app
 * Usage in components:
 * private media = inject(MediaService)
 * isMobile = media.match('(max-width: 600px)')
 */
@Injectable({ providedIn: 'root' })
export class MediaService implements OnDestroy {
  private readonly media = inject(MediaMatcher);

  private readonly queries = new Map<
    string,
    { mql: MediaQueryList; signal: WritableSignal<boolean>; listener: () => void }
  >();

  match(query: string = '(max-width: 320px)'): Signal<boolean> {
    if (!this.queries.has(query)) {
      const mql = this.media.matchMedia(query);
      const sig = signal(mql.matches);

      const listener = () => sig.set(mql.matches);
      mql.addEventListener('change', listener);

      this.queries.set(query, { mql, signal: sig, listener });
    }

    return this.queries.get(query)!.signal.asReadonly();
  }

  ngOnDestroy(): void {
    // clean up all listeners when the service itself is destroyed
    this.queries.forEach(({ mql, listener }) => mql.removeEventListener('change', listener));
    this.queries.clear();
  }
}
