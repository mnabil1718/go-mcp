import { Component, ElementRef, input, model, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive, UrlTree } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'rename-chat-nav',
  imports: [MatListModule, RouterLink, RouterLinkActive, FormsModule, MatInputModule],
  template: `
    <!-- Changing element [active] to "true" if routerLinkActive matches -->
    <mat-list-item
      [activated]="rla.isActive"
      #rla="routerLinkActive"
      [routerLink]="routerLinkParam()"
      [routerLinkActiveOptions]="{ exact: true }"
      routerLinkActive
      class="relative"
    >
      <input
        #input
        matInput
        [(ngModel)]="value"
        (blur)="onBlur()"
        (keydown)="onKeyDown($event)"
        (ngModelChange)="value.set($event)"
        (click)="$event.stopPropagation()"
        class="w-full mat-label-large outline-0"
      />
    </mat-list-item>
  `,
})
export class RenameNavComponent {
  value = model.required<string | undefined>();
  valueChanged = output<string | undefined>();
  readonly routerLinkParam = input.required<string | readonly any[] | UrlTree | null | undefined>();

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    const el = this.input.nativeElement;

    el.focus();

    setTimeout(() => {
      el.setSelectionRange(0, el.value.length);
    });
  }

  emitValue() {
    const val = this.value();
    if (val && val.trim() !== '') {
      this.valueChanged.emit(val);
    }
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.emitValue();
    }
  }

  onBlur(): void {
    this.emitValue();
  }
}
