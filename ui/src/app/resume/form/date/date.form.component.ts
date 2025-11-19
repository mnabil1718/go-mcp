import { JsonPipe } from '@angular/common';
import { Component, Inject, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DATE_FORMAT, DATE_FORMAT_LIST } from '../../../common/date/date.domain';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateFormat } from '../../../common/date/date.format';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import moment from 'moment';
@Component({
  selector: 'date-form',
  providers: [{ provide: MAT_DATE_FORMATS, useClass: CustomDateFormat }],
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
  templateUrl: 'date.form.template.html',
})
export class DateFormComponent {
  form = input.required<FormGroup>();

  constructor(@Inject(MAT_DATE_FORMATS) private formatter: CustomDateFormat) {}

  ngOnInit() {
    this.format?.valueChanges.subscribe((v: DATE_FORMAT) => {
      this.formatter.format = v;
    });
  }

  get format_list(): string[] {
    return DATE_FORMAT_LIST;
  }

  get format() {
    return this.form().get('format');
  }

  get ranged() {
    return this.form().get('ranged');
  }

  get start() {
    return this.form().get('start');
  }

  get end() {
    return this.form().get('end');
  }

  onChange(fmt: DATE_FORMAT): void {
    this.formatter.format = fmt;
    this.form().setControl('start', new FormControl(this.start?.value));
    this.form().setControl('end', new FormControl(this.end?.value));
  }

  onYearSelected(event: moment.Moment, dp: MatDatepicker<any>) {
    const ctrl = this.start || this.end;
    if (!ctrl) return;

    const value = moment(ctrl.value ?? new Date());
    value.year(event.year());

    ctrl.setValue(value);
    dp.close();
  }

  onMonthSelected(event: moment.Moment, dp: MatDatepicker<any>) {
    const ctrl = this.start || this.end;
    if (!ctrl) return;

    const value = moment(ctrl.value ?? new Date());
    value.year(event.year());
    value.month(event.month());

    ctrl.setValue(value);
    dp.close(); // prevent selecting day
  }
}
