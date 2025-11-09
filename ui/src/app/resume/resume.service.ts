import { Injectable } from '@angular/core';
import {
  Profile,
  ProfileNode,
  Resume,
  ResumeNode,
  Section,
  SectionItem,
  SectionNode,
} from './resume.domain';
import { FormGroup } from '@angular/forms';
import { PROFILE_NODE_TYPE, SECTION_NODE_TYPE } from './resume.data';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  nodetoFormGroup(resume: Resume): FormGroup {
    const g: any = {};

    return new FormGroup({});
  }

  nodetoResume(node: ResumeNode): Resume {
    return {
      id: node.id,
      title: node.title,
      created_at: node.created_at,
    };
  }

  nodetoSections(node: ResumeNode): Array<Profile | Section> {
    const cld: Array<ProfileNode | SectionNode> = node.children;
    if (cld.length < 1) {
      return [];
    }

    return cld.map((child) => {
      if (child.type === PROFILE_NODE_TYPE) {
        return {
          id: child.id,
          resume_id: node.id,
          position: child.position,
          name: child.name,
          photo_url: child.photo_url,
          content: child.content,
        };
      }

      return {
        id: child.id,
        resume_id: node.id,
        position: child.position,
        title: child.title,
        content: child.content,
      };
    });
  }

  nodeToSectionItems(node: ResumeNode): Array<SectionItem> {
    const sections = node.children;
    var section_items: Array<SectionItem> = [];

    if (sections.length < 1) {
      return section_items;
    }

    for (const section of sections) {
      // only SectionNode can have children
      if (section.type !== SECTION_NODE_TYPE) {
        continue;
      }

      for (const siNode of section.children) {
        section_items.push({
          id: siNode.id,
          section_id: section.id,
          position: siNode.position,
          content: siNode.content,
          title: siNode.title,
          subtext: siNode.subtext,
          right_subtext: siNode.right_subtext,
          date: siNode.date,
        });
      }
    }

    return section_items;
  }
}
