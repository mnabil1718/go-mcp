import { FieldErrors } from './error.domain';

export class ValidationError extends Error {
  public readonly fieldErrors: FieldErrors;

  constructor(message: string, fieldErrors: FieldErrors) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}
