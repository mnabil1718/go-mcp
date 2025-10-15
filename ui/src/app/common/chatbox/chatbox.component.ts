import { A11yModule } from '@angular/cdk/a11y';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { Component, effect, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatboxService } from './chatbox.service';

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
  service = inject(ChatboxService);
  onSubmitCallback = input.required<(prompt: string) => void>(); // return signal with callback
  isGenerating = input.required<boolean>();

  @ViewChild('chat') chat!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  ngAfterViewInit() {
    this.autosize.resizeToFitContent(true);
  }

  onInput() {
    if (this.service.prompt.value !== null) {
      const isTooLong = this.service.prompt.value.length > 56;
      const hasNewLine = this.service.prompt.value.includes('\n');
      this.service.sendUp.set(isTooLong || hasNewLine);
    }
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (
        this.service.prompt.value !== null &&
        !this.isGenerating() &&
        this.service.prompt.value.trim()
      ) {
        this.onSubmitCallback()(this.service.prompt.value.trim());
        this.service.prompt.setValue('');
        this.service.sendUp.set(false);
      }
    }
  }

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.service.prompt.value !== null) {
      this.onSubmitCallback()(this.service.prompt.value.trim());
      this.service.prompt.setValue('');
      this.service.sendUp.set(false);
    }
  }
}
