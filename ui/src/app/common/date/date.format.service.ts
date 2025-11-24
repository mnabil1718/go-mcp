import { Injectable, signal } from '@angular/core';
import { DATE_DISPLAY_FORMAT } from './date.domain';

@Injectable()
export class CustomDateService {
  format = signal<DATE_DISPLAY_FORMAT>(DATE_DISPLAY_FORMAT.DATE_MONTH_YEAR);
}
