import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { inject, Injectable } from '@angular/core';
import moment, { Moment } from 'moment';
import {
  ProfileNode,
  ResumeDate,
  ResumeNode,
  SectionItemNode,
  SectionNode,
} from '../resume.domain';
import { startDateRequiredValidator, validDateRangeValidator } from './date/date.form.validator';
import { Observable, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResumeFormService {
  private fb = inject(FormBuilder);
  private fg: FormGroup = this.fb.group({});

  get value$(): Observable<ResumeNode | null> {
    return this.fg.valueChanges.pipe(startWith(this.toTree()));
  }

  set form(tree: ResumeNode | null) {
    if (tree) {
      this.fg = this.fb.group({
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

  get profile(): FormGroup {
    return this.fg.get('profile') as FormGroup;
  }

  // sort position ASC will deep copy passed in array
  // works for section node and section item node
  public sort<T extends { position: number }>(arr: T[]): T[] {
    const res = structuredClone(arr);

    for (let i = 0; i < res.length; i++) {
      let temp_idx = i;
      for (let j = i + 1; j < res.length; j++) {
        if (res[j].position < res[temp_idx].position) {
          temp_idx = j;
        }
      }

      const temp = res[i];
      res[i] = res[temp_idx];
      res[temp_idx] = temp;
    }

    return res;
  }

  // Arrays
  public buildSectionArray(sections: Array<SectionNode>): FormArray {
    const sorted = this.sort(sections);
    const array: FormArray = this.fb.array([]);

    for (const s of sorted) {
      array.push(this.buildSectionGroup(s));
    }

    return array;
  }

  public buildSectionItemArray(section_items: Array<SectionItemNode>): FormArray {
    const sorted = this.sort(section_items);
    const array: FormArray = this.fb.array([]);

    for (const item of sorted) {
      array.push(this.buildSectionItemGroup(item));
    }

    return array;
  }

  // Nodes
  public buildProfileGroup(node: ProfileNode): FormGroup {
    return this.fb.group({
      name: [node?.name ?? ''],
      content: [node?.content ?? ''],
      photo_url: [node?.photo_url ?? null],
      id: [{ value: node.id, disabled: true }, Validators.required],
    });
  }

  // not inclusing position, as when editing might get reordered.
  public buildSectionGroup(node: SectionNode): FormGroup {
    return this.fb.group({
      title: [node.title ?? ''],
      content: [node.content ?? ''],
      section_items: this.buildSectionItemArray(node.section_items),
      id: [{ value: node.id, disabled: true }, Validators.required],
    });
  }

  // not including position, as when editing might get reordered.
  public buildSectionItemGroup(node: SectionItemNode): FormGroup {
    return this.fb.group({
      title: [node.title ?? ''],
      content: [node.content ?? ''],
      subtext: [node.subtext ?? ''],
      right_subtext: [node.right_subtext ?? ''],
      date: node.date ? this.buildDateGroup(node.date) : [null],
      id: [{ value: node.id, disabled: true }, Validators.required],
    });
  }

  public buildDateGroup(date: ResumeDate): FormGroup {
    return this.fb.group(
      {
        end: [this.parseDate(date?.end)],
        present: [date?.present ?? false],
        format: [date.format, Validators.required],
        ranged: [date.ranged, Validators.required],
        start: [this.parseDate(date.start), startDateRequiredValidator()],
      },
      {
        validators: validDateRangeValidator(),
      }
    );
  }

  // serialize
  public toTree(): ResumeNode | null {
    if (Object.keys(this.fg.controls).length === 0) {
      return null;
    }

    return {
      profile: this.toProfile(this.profile),
      sections: this.toSections(this.sections),
    };
  }

  public toProfile(profile: FormGroup): ProfileNode {
    return {
      id: profile.get('id')!.value,
      name: profile.get('name')?.value,
      content: profile.get('content')?.value,
      photo_url: profile.get('photo_url')?.value,
    };
  }

  public toSections(sections: FormArray): SectionNode[] {
    const array: SectionNode[] = [];
    for (const [idx, s] of sections.controls.entries()) {
      array.push({
        position: idx,
        id: s.get('id')!.value,
        title: s.get('title')?.value,
        content: s.get('content')?.value,
        section_items: this.toSectionItems(s.get('section_items') as FormArray),
      });
    }

    return array;
  }

  public toSectionItems(section_items: FormArray): SectionItemNode[] {
    const array: SectionItemNode[] = [];
    for (const [idx, s] of section_items.controls.entries()) {
      array.push({
        position: idx,
        id: s.get('id')!.value,
        title: s.get('title')?.value,
        content: s.get('content')?.value,
        subtext: s.get('subtext')?.value,
        right_subtext: s.get('right_subtext')?.value,
        date: s.get('date')?.value ? this.toResumeDate(s.get('date') as FormGroup) : undefined,
      });
    }
    return array;
  }

  public toResumeDate(date: FormGroup): ResumeDate {
    return {
      format: date.get('format')?.value,
      ranged: date.get('ranged')?.value,
      present: date.get('present')?.value,
      end: this.serializeDate(date.get('end')?.value),
      start: this.serializeDate(date.get('start')?.value)!,
    };
  }

  // Utils

  // format BE / API ISO date string.
  // Ex: 2025-12-12 to moment time
  public parseDate(s?: string): moment.Moment | null {
    if (!s) return null;

    return moment(s);
  }

  // from moment Date to string. not following format,
  // because DB will hold complete date regardless of 'format'.
  public serializeDate(m?: Moment): string | undefined {
    if (!m) return;

    return m.format('YYYY-MM-DD');
  }

  public addSection(s: SectionNode): void {
    this.sections.push(this.buildSectionGroup(s));
  }

  public addSectionItem(si: SectionItemNode, arr: FormArray): void {
    arr.push(this.buildSectionItemGroup(si));
  }

  public removeSectionAt(idx: number): void {
    this.sections.removeAt(idx);
  }

  // arr passed by reference because FormArray is type
  // obj/class this method mutate passed in FormArray
  public removeSectionItemAt(arr: FormArray, idx: number): void {
    arr.removeAt(idx);
  }
}
