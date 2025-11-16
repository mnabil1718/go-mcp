import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { QuillModule } from 'ngx-quill';
import 'quill/dist/quill.snow.css';

@Component({
  selector: 'editor',
  imports: [QuillModule, MatIconModule, ReactiveFormsModule],
  templateUrl: 'editor.template.html',
})
export class EditorComponent {
  control = input.required<FormControl>();
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link', { list: 'bullet' }],
    ],
  };
}
