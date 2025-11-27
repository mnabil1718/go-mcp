import { Inject, Injectable, Optional } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment, { Moment } from 'moment';
import { CustomDateService } from './date.format.service';

@Injectable()
export class CustomDateAdapter extends MomentDateAdapter {
  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) locale: string,
    @Inject(CustomDateService) private service: CustomDateService
  ) {
    super(locale);
  }

  /**
   * Parses a date from a user-provided value.
   * @param value The value to parse.
   * @param parseFormat The expected format of the value being parsed
   *     (type is implementation-dependent).
   * @returns The parsed date.
   */
  override parse(value: unknown, _: string | string[]): Moment | null {
    return moment(value as string, this.service.format(), true);
  }

  /**
   * Formats a date as a string according to the given format.
   * @param date The value to format.
   * @param displayFormat The format to use to display the date as a string.
   * @returns The formatted date string.
   */
  override format(date: Moment, _: string): string {
    return date.format(this.service.format());
  }
}
