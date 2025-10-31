export interface Resume {
  id: string;
  title: string;
  created_at: string;
}

export interface Profile {
  id: string;
  resume_id: string;
  photo_url?: string;
  name: string;
  data: string; // stringified JSON
}

export interface Section {
  id: string;
  resume_id: string;
  title: string;
  position: number;
  data: string; // stringified JSON
}

export interface SectionItem {
  id: string;
  section_id: string;
  position: number;
  data: string;
}

export interface ResumeState {
  resumes: ReadonlyArray<Resume>;
  sections: ReadonlyArray<Profile | Section>;
  section_items: ReadonlyArray<SectionItem>;
  selectedResumeId: Readonly<string | null>;
  loading: Readonly<boolean>;
}
