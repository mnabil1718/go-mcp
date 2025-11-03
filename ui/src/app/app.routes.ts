import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { ChatResolver, ChatTitleResolver } from './chat/chat.resolver';
import { EditorComponent } from './common/components/editor/editor.component';
import { IndexResumeComponent } from './resume/pages/index/index.resume.component';
import { MainLayoutComponent } from './common/layouts/main/main.layout.component';
import { ResumeLayoutComponent } from './common/layouts/resume/resume.layout.component';
import { EditResumeComponent } from './resume/pages/edit/edit.resume.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: 'Jahri.ai - Your AI Jobseeking Assistant' },
      {
        path: 'c/:id',
        component: ChatComponent,
        resolve: { chat: ChatResolver },
        title: ChatTitleResolver,
      },
      {
        path: 'r',
        component: IndexResumeComponent,
        title: 'Jahri.ai - Resume Builder',
      },
    ],
  },
  {
    path: 'r/:id',
    component: ResumeLayoutComponent,
    children: [
      {
        path: '',
        component: EditResumeComponent,
      },
    ],
  },
  {
    path: 'test-editor',
    component: EditorComponent,
    title: 'Test Editor',
  },
];
