import { Component, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'title-input-form',
  imports: [ReactiveFormsModule],
  styleUrl: 'title-input.form.css',
  templateUrl: 'title-input.form.template.html',
  host: {
    class: '!w-full',
  },
})
export class TitleInputFormComponent {
  placeholder = input<string>('Enter title...');
  control = input.required<FormControl>();
  value = signal<string>('');
}
