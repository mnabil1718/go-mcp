import { Component } from '@angular/core';

@Component({
  selector: 'drag-handle',
  imports: [],
  template: `
    <div class="text-slate-300 cursor-grab hover:text-slate-500 transition-colors duration-200">
      ⠿
    </div>
  `,
})
export class DragHandleComponent {}
