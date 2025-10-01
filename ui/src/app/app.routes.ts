import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { ChatResolver } from './chat/chat.resolver';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'c/:id', component: ChatComponent, resolve: { chat: ChatResolver } },
];
