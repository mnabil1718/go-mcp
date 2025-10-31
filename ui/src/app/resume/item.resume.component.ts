import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'resume-item-component',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: ` <li class="w-full aspect-[1/1.414]">
    <mat-card
      (mouseenter)="hovered.set(true)"
      (mouseleave)="hovered.set(false)"
      (click)="createNewResume()"
      class="cursor-pointer w-full h-full flex flex-col items-center justify-center"
      [appearance]="hovered() ? 'filled' : 'outlined'"
    >
      <mat-card-content class="!flex flex-col justify-center items-center space-y-1">
        <button matIconButton>
          <mat-icon fontSet="material-symbols-outlined">add</mat-icon>
        </button>
        <span> Add New Resume </span>
      </mat-card-content>
    </mat-card>
  </li>`,
})
export class ResumeItemCardComponent {
  hovered = signal<boolean>(false);
  createNewResume(): void {}
}
