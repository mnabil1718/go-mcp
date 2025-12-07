import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ResumeDeleteDialogData } from '../resume.domain';

@Component({
  selector: 'resume-delete-dialog',
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
    <h2 mat-dialog-title>Delete {{ label }}</h2>
    <mat-dialog-content>
      <p>This component and all of its content will be deleted. Are you sure?</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton (click)="onCancel()">Cancel</button>
      <button matButton="filled" class="error-confirm" [mat-dialog-close]="true" cdkFocusInitial>
        Delete
      </button>
    </mat-dialog-actions>
  `,
})
export class ResumeDeleteDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ResumeDeleteDialogComponent>);
  readonly data = inject<ResumeDeleteDialogData>(MAT_DIALOG_DATA);
  onCancel(): void {
    this.dialogRef.close();
  }

  get label(): string {
    switch (this.data.type) {
      case 'section_item':
        return 'Section Item';
      case 'date':
        return 'Date';
      default:
        return 'Section';
    }
  }
}
