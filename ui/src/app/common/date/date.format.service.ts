import { Injectable, signal } from '@angular/core';
import { DATE_FORMAT } from './date.domain';

@Injectable()
export class CustomDateService {
  private format: DATE_FORMAT = DATE_FORMAT.DATE_MONTH_YEAR;

  public setFormat(f: DATE_FORMAT): void {
    this.format = f;
  }
}
