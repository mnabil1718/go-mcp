import { Injectable } from '@angular/core';
import { micromark } from 'micromark';
import DOMPurify from 'dompurify';

@Injectable({ providedIn: 'root' })
export class MarkdownService {
  parse(message: string): string {
    DOMPurify.sanitize(message, {
      ALLOWED_TAGS: ['p', 'em', 'strong', 'a', 'code', 'pre', 'ul', 'ol', 'li', 'blockquote', 'hr'],
      ALLOWED_ATTR: ['href', 'title'],
    });

    return micromark(message);
  }
}
