import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { ChatResolver, ChatTitleResolver } from './chat/chat.resolver';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Jahri.ai - Your AI Jobseeking Assistant' },
  {
    path: 'c/:id',
    component: ChatComponent,
    resolve: { chat: ChatResolver },
    title: ChatTitleResolver,
  },
];
