import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'chat-delete-dialog-component',
  styles: `
    .error-confirm {
      background-color: var(--mat-sys-error) !important;
    }
  `,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Delete Chat</h2>
    <mat-dialog-content>
      <p>Are you sure you want to permanently delete this chat?</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton (click)="onCancel()">Cancel</button>
      <button matButton="filled" class="error-confirm" [mat-dialog-close]="true" cdkFocusInitial>
        Delete
      </button>
    </mat-dialog-actions>
  `,
})
export class ChatDeleteDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ChatDeleteDialogComponent>);
  onCancel(): void {
    this.dialogRef.close();
  }
}
