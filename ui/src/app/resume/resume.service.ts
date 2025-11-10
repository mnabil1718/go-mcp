import { Injectable } from '@angular/core';
import { Resume, ResumeNode } from './resume.domain';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  public treeToResume(tree: ResumeNode): Readonly<Resume> {
    return {
      id: tree.id,
      title: tree.title,
      created_at: tree.created_at,
    };
  }
}
