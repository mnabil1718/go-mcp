export interface FilePreview {
  url: string;
  size: number;
  file_name: string;
  mime_type: string;
}

export interface FileInputOptions {
  multiple: boolean;
  accept: string[];
  max_size: number;
}
