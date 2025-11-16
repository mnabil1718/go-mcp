import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { inject, Injectable } from '@angular/core';
import {
  ProfileNode,
  ResumeDate,
  ResumeNode,
  SectionItemNode,
  SectionNode,
} from '../resume.domain';

@Injectable({ providedIn: 'root' })
export class ResumeFormService {
  private fb = inject(FormBuilder);
  private fg: FormGroup = this.fb.group({});

  set form(tree: ResumeNode | null) {
    if (tree) {
      this.fg = this.fb.group({
        title: [tree.title, Validators.required],
        profile: this.buildProfileGroup(tree.profile),
        sections: this.buildSectionArray(tree.sections),
      });
    }
  }

  get form(): FormGroup {
    return this.fg;
  }

  get sections(): FormArray {
    return this.fg.get('sections') as FormArray;
  }

  // Arrays
  public buildSectionArray(sections: Array<SectionNode>): FormArray {
    let array: FormArray = this.fb.array([]);

    for (const s of sections) {
      array.push(this.buildSectionGroup(s));
    }

    return array;
  }

  public buildSectionItemArray(section_items: Array<SectionItemNode>): FormArray {
    let array: FormArray = this.fb.array([]);

    for (const item of section_items) {
      array.push(this.buildSectionItemGroup(item));
    }

    return array;
  }

  // Nodes
  private buildProfileGroup(node: ProfileNode | undefined): FormGroup {
    return this.fb.group({
      photo_url: [node?.photo_url ?? null],
      name: [node?.name ?? ''],
      content: [node?.content ?? ''],
    });
  }

  private buildSectionGroup(node: SectionNode): FormGroup {
    return this.fb.group({
      title: [node.title ?? ''],
      content: [node.content ?? ''],
      section_items: this.buildSectionItemArray(node.section_items),
    });
  }

  private buildSectionItemGroup(node: SectionItemNode): FormGroup {
    return this.fb.group({
      content: [node.content ?? ''],
      title: [node.title ?? ''],
      subtext: [node.subtext ?? ''],
      right_subtext: [node.right_subtext ?? ''],
      date: this.buildDateGroup(node.date),
    });
  }

  private buildDateGroup(date?: ResumeDate): FormGroup {
    return this.fb.group({
      ranged: [date?.ranged ?? false, Validators.required],
      start: [date?.start ?? '', Validators.required],
      end: [date?.end ?? ''],
      present: [date?.present ?? false],
    });
  }
}
