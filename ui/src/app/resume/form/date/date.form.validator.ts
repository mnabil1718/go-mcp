import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Moment } from 'moment';

export function validDateRangeValidator(): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const start = ctrl.get('start');
    const end = ctrl.get('end');
    const ranged = ctrl.get('ranged');

    const startDate = start?.value as Moment | null;
    const endDate = end?.value as Moment | null;

    if (!ranged?.value) return null;

    if (!endDate) {
      end?.setErrors({ end: { message: 'end date cannot be empty' } });
      return null;
    }

    if (!startDate?.isBefore(endDate)) {
      end?.setErrors({ end: { message: 'end date must be after start date' } });
      return null;
    }

    return null;
  };
}

export function endRequiredIfRanged(): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const end = ctrl.get('end');
    const ranged = ctrl.get('ranged');

    const endDate = end?.value as Moment | null;

    if (!ranged?.value) return null;

    if (!endDate) {
      end?.setErrors({ endRequired: { message: 'end date cannot be empty' } });
    }

    return null;
  };
}
