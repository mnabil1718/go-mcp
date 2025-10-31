import { inject, Injectable, signal } from '@angular/core';
import { MediaService } from '../../media/media.service';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidenavService {
  private media = inject(MediaService);
  isMobile = this.media.match('(max-width: 600px)');
  isOpened = signal<boolean>(this.isMobile() ? false : true);

  private _toggle$ = new Subject<void>();
  toggle$ = this._toggle$.asObservable();

  // return toggle event without value
  // letting subscriber do whatever it
  // wants with the toggled event
  toggle() {
    return this._toggle$.next();
  }
}
