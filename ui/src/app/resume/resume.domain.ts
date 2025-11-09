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
  position: number;
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
  sections: ReadonlyArray<Profile | Section>;
  section_items: ReadonlyArray<SectionItem>;
  selectedResumeId: Readonly<string | null>;
  loading: Readonly<boolean>;
}

// UI / In-memory Tree

export interface NodeBase {
  id: string;
  type: string;
}

export interface ResumeNode extends NodeBase {
  type: 'resume';
  title: string;
  created_at: string;
  children: Array<SectionNode | ProfileNode>;
}

export interface ProfileNode extends NodeBase {
  type: 'profile'; // literal discriminator, so compiler knows we are working with Profile
  position: number;
  photo_url?: string;
  name?: string;
  content?: ResumeRichText;
}

export interface SectionNode extends NodeBase {
  type: 'section'; // literal discriminator, so compiler knows we are working with Section
  position: number;
  title?: string;
  content?: ResumeRichText;
  children: Array<SectionItemNode>;
}

export interface SectionItemNode extends NodeBase {
  type: 'section_item';
  position: number;
  content?: ResumeRichText;
  title?: string;
  subtext?: string;
  right_subtext?: string;
  date?: ResumeDate;
}
