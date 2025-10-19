import { Component, inject, input } from '@angular/core';
import { NavItemComponent } from '../common/sidenav/nav.item.component';
import { Chat } from './chat.domain';
import { SidenavItemMenu } from '../common/sidenav/sidenav.domain';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ChatRenameDialogComponent } from './dialog/chat.rename.dialog.component';
import { Store } from '@ngrx/store';
import { ChatActions } from './store/chat.action';
import { ChatDeleteDialogComponent } from './dialog/chat.delete.dialog.component';

@Component({
  selector: 'chat-nav-component',
  imports: [
    NavItemComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: 'chat.nav.template.html',
})
export class ChatNavComponent {
  private store = inject(Store);
  chat = input.required<Chat>();
  dialog = inject(MatDialog);

  onRenameHandler(): void {
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
      this.store.dispatch(ChatActions.rename({ id: this.chat().id, title: newTitle }));
    });
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
