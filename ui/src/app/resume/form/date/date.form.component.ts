import { Component, inject, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DATE_DISPLAY_FORMAT, DATE_DISPLAY_FORMAT_LIST } from '../../../common/date/date.domain';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MediaService } from '../../../common/media/media.service';
import { Moment } from 'moment';
import { CustomDateService } from '../../../common/date/date.format.service';
import { CustomDateAdapter } from '../../../common/date/date.format.adapter';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DeleteButtonComponent } from '../delete/delete-button.component';
@Component({
  selector: 'date-form',
  providers: [
    CustomDateService,
    { provide: MAT_DATE_LOCALE, useValue: 'id' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
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
    MatButtonModule,
    MatIconModule,
    DeleteButtonComponent,
  ],
  styleUrl: 'date.form.css',
  templateUrl: 'date.form.template.html',
})
export class DateFormComponent {
  media = inject(MediaService);
  form = input.required<FormGroup>();
  service = inject(CustomDateService);
  delete = output<Event>();
  adapter = inject(DateAdapter<Moment>);
  isMobile = this.media.match('(max-width: 600px)');
  isTablet = this.media.match('(max-width: 1024px)');

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

  onFormatChange(fmt: DATE_DISPLAY_FORMAT): void {
    this.service.format.set(fmt);

    const startVal = this.start?.value;
    const endVal = this.end?.value;
    this.start?.setValue(startVal);
    this.end?.setValue(endVal);
  }

  getEndErrorMessage(errors: ValidationErrors | null | undefined): string {
    if (!errors) return '';
    const endErr = errors['end'];
    if (endErr) return endErr.message;
    return '';
  }

  getStartErrorMessage(errors: ValidationErrors | null | undefined): string {
    if (!errors) return '';
    const required = errors['required'];
    if (required.message) return required.message;
    return 'start date is required.';
  }
}
