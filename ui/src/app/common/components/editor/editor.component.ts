import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { QuillModule } from 'ngx-quill';
import 'quill/dist/quill.snow.css';

@Component({
  selector: 'editor-component',
  imports: [QuillModule, MatIconModule],
  templateUrl: 'editor.template.html',
})
export class EditorComponent {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link', { list: 'bullet' }],
    ],
  };
}
