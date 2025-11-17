import { ResumeNode, SectionItemNode } from './resume.domain';

function _genId(): string {
  return crypto.randomUUID();
}

export function buildSeedTree(temp_id: string): ResumeNode {
  return {
    id: temp_id,
    title: 'My New Resume',
    created_at: new Date().toISOString(),
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
            },
          },
          {
            id: _genId(),
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
        position: 4,
        title: 'Skills',
        content: 'Go, SQL, Typescript, PHP, Laravel, NodeJS, Python, Docker, Linux, Git',
        section_items: [],
      },
    ],
  };
}
