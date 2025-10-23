import { ValidationError } from '../exceptions/validation.error';

export function getErrorMessage(error: Error): string {
  if (error instanceof ValidationError) {
    // show the first field error, snackbar can only shown one at a time
    return Object.values(error.fieldErrors).at(0)!;
  }

  return error.message;
}
