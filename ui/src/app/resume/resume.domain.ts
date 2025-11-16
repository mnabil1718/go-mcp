import { FilePreview } from '../common/components/file/input.file.domain';

// Common
export interface ResumeDate {
  ranged: boolean;
  start: string; // flexible yyyy-mm-dd or yyyy-mm or yyyy (ISO date string)
  end?: string; // flexible yyyy-mm-dd or yyyy-mm or yyyy (ISO date string)
  present?: boolean;
}

export type ResumeRichText = string; // rich text stringified

// Store & BE

export interface Resume {
  id: string;
  title: string;
  created_at: string;
}

export interface Profile {
  id: string;
  resume_id: string;
  photo_url?: string;
  name?: string;
  content?: ResumeRichText;
}

export interface Section {
  id: string;
  resume_id: string;
  position: number;
  title?: string;
  content?: ResumeRichText;
}

export interface SectionItem {
  id: string;
  section_id: string;
  position: number;
  content?: ResumeRichText;
  title?: string;
  subtext?: string;
  right_subtext?: string;
  date?: ResumeDate;
}

export interface ResumeState {
  resumes: ReadonlyArray<Resume>;
  selectedId: Readonly<string | null>;
  selectedTree: Readonly<ResumeNode | null>;
  loading: Readonly<boolean>;
}

// UI / In-memory Tree

export interface ResumeNode {
  id: string;
  title: string;
  created_at: string;
  profile?: ProfileNode;
  sections: Array<SectionNode>;
}

export interface ProfileNode {
  id: string;
  name?: string;
  photo_url?: FilePreview;
  content?: ResumeRichText;
}

export interface SectionNode {
  id: string;
  position: number;
  title?: string;
  content?: ResumeRichText;
  section_items: Array<SectionItemNode>;
}

export interface SectionItemNode {
  id: string;
  position: number;
  content?: ResumeRichText;
  title?: string;
  subtext?: string;
  right_subtext?: string;
  date?: ResumeDate;
}
