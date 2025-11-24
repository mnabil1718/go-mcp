import { Inject, Injectable, Optional } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Moment } from 'moment';
import { CustomDateService } from './date.format.service';

@Injectable()
export class CustomDateAdapter extends MomentDateAdapter {
  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) locale: string,
    @Inject(CustomDateService) private service: CustomDateService
  ) {
    super(locale);
  }

  override format(date: Moment, displayFormat: string): string {
    if (!date) return '';
    return date.format(this.service.format());
  }
}
