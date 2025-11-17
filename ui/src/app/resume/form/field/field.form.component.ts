import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'field-form',
  imports: [CommonModule],
  styleUrl: 'field.form.css',
  templateUrl: 'field.form.template.html',
})
export class FieldFormComponent {
  control = input.required<FormControl>();
  label = input.required<string>();
  hint = input<string>('');

  getErrorMessage(errors: ValidationErrors | null): string {
    if (!errors) return '';

    if (errors['required']) return 'This field is required.';

    // fallback
    const key = Object.keys(errors)[0];
    return errors[key]?.message ?? 'Invalid input.';
  }
}
