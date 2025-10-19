import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChatRenameDialogData } from '../chat.domain';

@Component({
  selector: 'chat-rename-dialog-component',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Rename Chat Title</h2>
    <mat-dialog-content>
      <mat-form-field class="w-full">
        <input
          matInput
          cdkFocusInitial
          type="text"
          placeholder="Enter chat title"
          [formControl]="title"
          (keydown)="keyDownHandler($event)"
        />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton (click)="onCancel()">Cancel</button>
      <button matButton="filled" [disabled]="!title.value?.trim()" [mat-dialog-close]="title.value">
        Rename
      </button>
    </mat-dialog-actions>
  `,
})
export class ChatRenameDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ChatRenameDialogComponent>);
  readonly data = inject<ChatRenameDialogData>(MAT_DIALOG_DATA);
  title = new FormControl(this.data.inputDefaultValue ?? 'New Chat', [
    Validators.required,
    Validators.max(80),
  ]);
  onCancel(): void {
    this.dialogRef.close();
  }
  keyDownHandler(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (this.title.value !== null && this.title.value.trim()) {
        this.dialogRef.close(this.title.value);
      }
    }
  }
}
