import { FileInputOptions } from './input.file.domain';

export const defaultOpts: FileInputOptions = {
  accept: ['image/jpeg', 'image/png', 'image/webp'],
  multiple: false,
  max_size: 5 * 1024 * 1024,
};
