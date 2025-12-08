import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MediaService } from '../../../common/media/media.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'delete-button',
  imports: [MatButtonModule, MatTooltipModule, MatIconModule],
  template: `
    <button matIconButton [matTooltip]="tooltip()" (click)="delete.emit($event)">
      <mat-icon fontSet="material-symbols-outlined" class="text-error">delete</mat-icon>
    </button>
  `,
  host: {
    '[class.flex]': 'isTablet()',
    '[class.hidden]': '!isTablet()',
    class: 'group-hover:flex',
  },
})
export class DeleteButtonComponent {
  private media = inject(MediaService);
  isTablet = this.media.match('(max-width: 1024px)');
  delete = output<Event>();
  tooltip = input<string>('Delete');
}
