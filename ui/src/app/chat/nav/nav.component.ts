import { Component, effect, inject, input, signal } from '@angular/core';
import { NavItemComponent } from '../../common/sidenav/nav.item.component';
import { Chat } from '../chat.domain';
import { SidenavItemMenu } from '../../common/sidenav/sidenav.domain';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ChatRenameDialogComponent } from '../dialog/chat.rename.dialog.component';
import { Store } from '@ngrx/store';
import { ChatActions } from '../store/chat.action';
import { ChatDeleteDialogComponent } from '../dialog/chat.delete.dialog.component';
import { Router } from '@angular/router';
import { RenameNavComponent } from './rename.nav.component';
import { MediaService } from '../../common/media/media.service';

@Component({
  selector: 'chat-nav-component',
  imports: [
    NavItemComponent,
    ReactiveFormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    RenameNavComponent,
  ],
  templateUrl: 'nav.template.html',
})
export class ChatNavComponent {
  private store = inject(Store);
  router = inject(Router);
  chat = input.required<Chat>();
  dialog = inject(MatDialog);
  private media = inject(MediaService);
  isTablet = this.media.match('(max-width: 1024px)');

  renameMode = signal<boolean>(false);

  inlineRenameHandler(out: string | undefined) {
    if (out && out.trim() !== this.chat().title) {
      this.store.dispatch(ChatActions.rename({ id: this.chat().id, title: out }));
    }

    this.renameMode.set(false);
  }

  renameOnDialog(): void {
    const ref = this.dialog.open(ChatRenameDialogComponent, {
      data: { inputDefaultValue: this.chat().title },
      maxWidth: '400px',
      width: '100%',
    });

    ref.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      const newTitle = res.trim();
      if (newTitle && newTitle !== '' && newTitle !== this.chat().title) {
        this.store.dispatch(ChatActions.rename({ id: this.chat().id, title: newTitle }));
      }
    });
  }

  onRenameHandler(): void {
    if (!this.isTablet()) {
      // inline rename listener @ inlineRenameHandler
      this.renameMode.set(true);
    } else {
      this.renameOnDialog();
    }
  }

  onDeleteHandler(): void {
    const ref = this.dialog.open(ChatDeleteDialogComponent, {
      maxWidth: '400px',
      width: '100%',
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      if (confirmed) {
        this.store.dispatch(ChatActions.delete({ id: this.chat().id }));
      }
    });
  }

  getChatMenu(): SidenavItemMenu {
    return [
      {
        label: 'Rename',
        actionCallback: (): void => this.onRenameHandler(),
      },
      {
        label: 'Delete',
        actionCallback: (): void => this.onDeleteHandler(),
      },
    ];
  }
}
