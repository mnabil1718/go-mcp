import { A11yModule } from '@angular/cdk/a11y';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { Component, effect, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'chatbox',
  templateUrl: 'chatbox.template.html',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    A11yModule,
  ],
})
export class ChatboxComponent {
  onSubmitCallback = input.required<(prompt: string) => void>(); // return signal with callback
  prompt = new FormControl('');
  sendUp = signal<boolean>(false);
  isGenerating = input.required<boolean>();

  @ViewChild('chat') chat!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  ngAfterViewInit() {
    this.autosize.resizeToFitContent(true);
  }

  onInput() {
    if (this.prompt.value !== null) {
      const isTooLong = this.prompt.value.length > 56;
      const hasNewLine = this.prompt.value.includes('\n');
      this.sendUp.set(isTooLong || hasNewLine);
    }
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (this.prompt.value !== null && !this.isGenerating()) {
        this.onSubmitCallback()(this.prompt.value.trim());
        this.prompt.setValue('');
        this.sendUp.set(false);
      }
    }
  }

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.prompt.value !== null) {
      this.onSubmitCallback()(this.prompt.value.trim());
      this.prompt.setValue('');
      this.sendUp.set(false);
    }
  }
}
