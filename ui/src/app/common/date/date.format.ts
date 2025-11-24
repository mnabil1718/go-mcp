import { CustomDateService } from './date.format.service';

export function matDateFormats(service: CustomDateService) {
  return {
    parse: { dateInput: service.format() },
    display: {
      dateInput: service.format(),
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: service.format(),
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };
}
