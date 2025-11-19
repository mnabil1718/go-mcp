import { Injectable } from '@angular/core';
import { DATE_FORMAT } from './date.domain';

export class CustomDateFormat {
  private value: DATE_FORMAT = DATE_FORMAT.DATE_MONTH_YEAR;

  set format(value: DATE_FORMAT) {
    this.value = value;
  }

  get format(): DATE_FORMAT {
    return this.value;
  }

  get display() {
    const fmtd = this.format.replace(/-/g, '/');
    return {
      dateInput: fmtd,
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: fmtd,
      monthYearA11yLabel: 'MMMM YYYY',
    };
  }

  get parse() {
    const fmtd = this.format.replace(/\//g, '-');
    return {
      dateInput: fmtd,
    };
  }
}
