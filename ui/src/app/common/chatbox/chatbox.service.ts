import { Injectable, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ChatboxService {
  sendUp = signal<boolean>(false);
  prompt = new FormControl('');
}
