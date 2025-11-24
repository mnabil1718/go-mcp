import { Component, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DATE_DISPLAY_FORMAT, DATE_DISPLAY_FORMAT_LIST } from '../../../common/date/date.domain';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { matDateFormats } from '../../../common/date/date.format';
import { MediaService } from '../../../common/media/media.service';
import { Moment } from 'moment';
import { CustomDateService } from '../../../common/date/date.format.service';
import { CustomDateAdapter } from '../../../common/date/date.format.adapter';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
@Component({
  selector: 'date-form',
  providers: [
    CustomDateService,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, deps: [CustomDateService], useFactory: matDateFormats },
  ],
  imports: [
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
  ],
  styleUrl: 'date.form.css',
  templateUrl: 'date.form.template.html',
})
export class DateFormComponent {
  media = inject(MediaService);
  adapter = inject(DateAdapter<Moment>);
  service = inject(CustomDateService);
  form = input.required<FormGroup>();
  isMobile = this.media.match('(max-width: 600px)');

  ngOnInit() {
    this.format?.valueChanges.subscribe((v: DATE_DISPLAY_FORMAT) => {
      this.service.format.set(v);
    });
  }

  get format_list(): string[] {
    return DATE_DISPLAY_FORMAT_LIST;
  }

  get format() {
    return this.form().get('format');
  }

  get ranged() {
    return this.form().get('ranged');
  }

  get present() {
    return this.form().get('present');
  }

  get start() {
    return this.form().get('start');
  }

  get end() {
    return this.form().get('end');
  }

  get endDisplay(): string {
    const present = this.present?.value;
    const endValue = this.end?.value;

    if (present) return 'present';
    if (endValue) return this.adapter.format(endValue, this.service.format());
    return '';
  }

  onFormatChange(fmt: DATE_DISPLAY_FORMAT): void {
    this.service.format.set(fmt);
    this.form().setControl('start', new FormControl(this.start?.value));
    this.form().setControl('end', new FormControl(this.end?.value));
  }

  // onPresentChange(e: MatCheckboxChange) {
  //   const checked = e.checked;
  //   if (!checked) return;
  //   this.end?.setValue(moment());
  // }
}
