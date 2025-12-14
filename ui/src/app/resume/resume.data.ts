import { DATE_DISPLAY_FORMAT } from '../common/date/date.domain';
import {
  PageMargins,
  PageSize,
  ResumeDate,
  ResumeNode,
  SectionItemNode,
  SectionNode,
} from './resume.domain';

function _genId(): string {
  return crypto.randomUUID();
}

export function buildSeedTree(): ResumeNode {
  return {
    profile: {
      id: _genId(),
      name: 'Your Name',
      content: 'Example',
    },
    sections: [
      {
        id: _genId(),
        position: 1,
        title: 'Professional Experience',
        section_items: [
          {
            id: _genId(),
            position: 1,
            title: 'Freelance Fullstack Engineer',
            subtext: 'Tingkatin Technology',
            right_subtext: 'Bogor, Indonesia',
            date: {
              ranged: true,
              start: '2021-06-12',
              end: '2023-12-10',
              format: DATE_DISPLAY_FORMAT.DATE_MONTH_YEAR,
            },
          },
          {
            id: _genId(),
            position: 2,
            title: 'Fullstack Developer',
            subtext: 'Dikshatek Technology',
            right_subtext: 'Jakarta, Indonesia',
            date: {
              ranged: true,
              format: DATE_DISPLAY_FORMAT.DATE_MONTH_YEAR,
              start: '2023-12-11',
              end: '2024-03-11',
            },
          },
          {
            id: _genId(),
            position: 3,
            title: 'Freelance Web Developer',
            subtext: 'Upwork',
            right_subtext: 'Bogor, Indonesia',
            date: {
              ranged: true,
              format: DATE_DISPLAY_FORMAT.DATE_MONTH_YEAR,
              start: '2024-03-11',
              present: true,
            },
          },
        ],
      },
      {
        id: _genId(),
        position: 2,
        title: 'Education',
        section_items: [
          {
            id: _genId(),
            position: 1,
            title: 'UIN Sunan Gunung Djati Bandung',
            subtext: 'Informatics Engineering',
            right_subtext: 'Bandung, Indonesia',
            date: {
              ranged: true,
              start: '2017-11',
              end: '2023-12-27',
              format: DATE_DISPLAY_FORMAT.DATE_MONTH_YEAR,
            },
          },
        ],
      },
      {
        id: _genId(),
        position: 3,
        title: 'Training & Certifications',
        section_items: [
          {
            id: _genId(),
            position: 1,
            title: 'IDCamp 2024 Backend Developer Path',
            subtext: 'Dicoding Indonesia',
            date: {
              ranged: true,
              start: '2024-09',
              end: '2025-05',
              format: DATE_DISPLAY_FORMAT.DATE_MONTH_YEAR,
            },
          },
          {
            id: _genId(),
            position: 1,
            title: 'Coursera Google IT Automation with Python',
            subtext: 'Coursera',
            // date: {
            //   ranged: true,
            //   start: '2021-10',
            //   end: '2021-11',
            //   format: DATE_DISPLAY_FORMAT.DATE_MONTH_YEAR,
            // },
          },
        ],
      },
      {
        id: _genId(),
        position: 4,
        title: 'Skills',
        content: 'Go, SQL, Typescript, PHP, Laravel, NodeJS, Python, Docker, Linux, Git',
        section_items: [],
      },
    ],
  };
}

export const NEW_SECTION: SectionNode = {
  id: crypto.randomUUID(),
  position: 1, // not important, recalculated when save
  title: 'New Section',
  section_items: [],
};

export const NEW_SECTION_ITEM: SectionItemNode = {
  id: crypto.randomUUID(),
  position: 1, // not important
  title: 'New Section Item',
  subtext: 'Good Company, Inc.',
  right_subtext: 'San Francisco, CA',
};

export const NEW_DATE: ResumeDate = {
  format: DATE_DISPLAY_FORMAT.DATE_MONTH_YEAR,
  start: new Date().toISOString(),
  ranged: false,
};

export const PAGE_SIZE_A4: PageSize = {
  width: 210, // mm
  height: 297 + 2, // mm
};

export const PAGE_PRINT_MARGIN: PageMargins = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20,
};

export const BASE_FONT_SIZE = 10.5; // pt
export const BASE_LINE_HEIGHT = 1.4; // pt

export const MM_TO_PX = 3.78; //  for sizeToPx = mm * MM_TO_PX
