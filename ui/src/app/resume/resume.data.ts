import { ResumeNode } from './resume.domain';

export const RESUME_NODE_TYPE = 'resume';
export const SECTION_NODE_TYPE = 'section';
export const PROFILE_NODE_TYPE = 'profile';
export const SECTION_ITEM_NODE_TYPE = 'section_item';

function _genId(): string {
  return crypto.randomUUID();
}

export function buildSeedTree(temp_id: string): ResumeNode {
  return {
    id: temp_id,
    type: RESUME_NODE_TYPE,
    title: 'My New Resume',
    created_at: new Date().toISOString(),
    children: [
      {
        id: _genId(),
        type: PROFILE_NODE_TYPE,
        position: 1,
        name: 'Your Name',
      },
      {
        id: _genId(),
        type: SECTION_NODE_TYPE,
        position: 2,
        title: 'Professional Experience',
        children: [
          {
            id: _genId(),
            type: SECTION_ITEM_NODE_TYPE,
            position: 1,
            title: 'Freelance Fullstack Engineer',
            subtext: 'Tingkatin Technology',
            right_subtext: 'Bogor, Indonesia',
            date: {
              ranged: true,
              start: '2021-06-12',
              end: '2023-12-10',
            },
          },
          {
            id: _genId(),
            type: SECTION_ITEM_NODE_TYPE,
            position: 2,
            title: 'Fullstack Developer',
            subtext: 'Dikshatek Technology',
            right_subtext: 'Jakarta, Indonesia',
            date: {
              ranged: true,
              start: '2023-12-11',
              end: '2024-03-11',
            },
          },
          {
            id: _genId(),
            type: SECTION_ITEM_NODE_TYPE,
            position: 3,
            title: 'Freelance Web Developer',
            subtext: 'Upwork',
            right_subtext: 'Bogor, Indonesia',
            date: {
              ranged: true,
              start: '2024-03-11',
              present: true,
            },
          },
        ],
      },
      {
        id: _genId(),
        type: SECTION_NODE_TYPE,
        position: 3,
        title: 'Education',
        children: [
          {
            id: _genId(),
            type: SECTION_ITEM_NODE_TYPE,
            position: 1,
            title: 'UIN Sunan Gunung Djati Bandung',
            subtext: 'Informatics Engineering',
            right_subtext: 'Bandung, Indonesia',
            date: {
              ranged: true,
              start: '2017-11',
              end: '2023-12-27',
            },
          },
        ],
      },
      {
        id: _genId(),
        type: SECTION_NODE_TYPE,
        position: 4,
        title: 'Training & Certifications',
        children: [
          {
            id: _genId(),
            type: SECTION_ITEM_NODE_TYPE,
            position: 1,
            title: 'IDCamp 2024 Backend Developer Path',
            subtext: 'Dicoding Indonesia',
            date: {
              ranged: true,
              start: '2024-09',
              end: '2025-05',
            },
          },
          {
            id: _genId(),
            type: SECTION_ITEM_NODE_TYPE,
            position: 1,
            title: 'Coursera Google IT Automation with Python',
            subtext: 'Coursera',
            date: {
              ranged: true,
              start: '2021-10',
              end: '2021-11',
            },
          },
        ],
      },
      {
        id: _genId(),
        type: SECTION_NODE_TYPE,
        position: 5,
        title: 'Skills',
        content: 'Go, SQL, Typescript, PHP, Laravel, NodeJS, Python, Docker, Linux, Git',
        children: [],
      },
    ],
  };
}
