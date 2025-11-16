import { Component, ElementRef, input, signal, ViewChild } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { appendSizeUnit } from '../../helpers/file';
import { defaultOpts } from './input.file.data';
import { FileInputOptions, FilePreview } from './input.file.domain';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'file-input',
  imports: [MatIconModule, ReactiveFormsModule, MatButtonModule, MatTooltipModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FileInputComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FileInputComponent,
    },
  ],
  styleUrl: 'input.file.css',
  templateUrl: 'input.file.template.html',
})
export class FileInputComponent implements ControlValueAccessor, Validator {
  opts = input<FileInputOptions>(defaultOpts);
  file_preview = signal<FilePreview | null>(null);
  disabled = signal<boolean>(false);
  touched = signal<boolean>(false);
  dragging = signal<boolean>(false);

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  get file_size(): string {
    let size = this.file_preview()?.size ?? 0;
    return appendSizeUnit(size);
  }

  get is_image(): boolean {
    const file = this.file_preview();
    return file?.mime_type?.startsWith('image/') ?? false;
  }

  writeValue(obj: any): void {
    this.file_preview.set(obj as FilePreview | null);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const val = control.value as FilePreview | null;
    if (!val) return null;

    if (val.size > this.opts().max_size) {
      return {
        image: { message: `file size cannot exceeds ${appendSizeUnit(this.opts().max_size)}` },
      };
    }

    if (!this.opts().accept.includes(val.mime_type)) {
      return {
        image: { message: 'file has to be an image' },
      };
    }

    return null;
  }

  private handleFiles(files: FileList): void {
    for (const file of files) {
      const r: FileReader = new FileReader();
      // defining callback, executes on read
      r.onload = (e: ProgressEvent<FileReader>) => {
        const prev: FilePreview = {
          url: e.target?.result as string,
          file_name: file.name,
          mime_type: file.type,
          size: file.size,
        };
        this.onChange(prev);
        this.file_preview.set(prev);
      };
      // read
      r.readAsDataURL(file);
    }
  }

  private overrideDefault(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }

  onClick(): void {
    this.markAsTouched();
    this.input.nativeElement.click();
  }

  onDragOver(e: DragEvent): void {
    this.overrideDefault(e);
    this.dragging.set(true);

    // OPTIONAL TODO
  }

  onDragLeave(e: DragEvent): void {
    this.overrideDefault(e);
    this.dragging.set(false);

    // OPTIONAL TODO
  }

  onDrop(e: DragEvent): void {
    this.overrideDefault(e);

    const files = e.dataTransfer?.files;

    // files is null or length == 0
    if (!files?.length) {
      return;
    }

    this.markAsTouched();
    this.handleFiles(files);
  }

  onInputChanged(e: Event): void {
    const files = (e.target as HTMLInputElement).files;

    // files is null or length == 0
    if (!files?.length) {
      return;
    }

    this.handleFiles(files);
  }

  markAsTouched(): void {
    if (!this.touched()) {
      this.onTouched();
      this.touched.set(true);
    }
  }

  reset(): void {
    this.onChange(null);
    this.file_preview.set(null);
    this.input.nativeElement.value = '';
  }
}
