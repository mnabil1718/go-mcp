import { FormControl } from '@angular/forms';
import { Message } from '../message/message.domain';
import { Signal } from '@angular/core';

export interface Chat {
  id: string;
  title?: string;
  created_at: string;
}

export interface ChatWithMessages {
  id: string;
  title?: string;
  created_at: string;
  messages: Message[];
}

export interface SaveMessageRequest {
  chat_id: string;
  message: string;
}

export interface RenameRequest {
  chat_id: string;
  title: string;
}

export interface ChatState {
  chats: ReadonlyArray<Chat>;
  selectedChatId: Readonly<string | null>; // selected chat id, points to a specific chat in chats
  messages: ReadonlyArray<Message>; // selected chat messages only: each have chat_id
  thinking: Readonly<boolean>; // from first request sent to first token returned
  generating: Readonly<boolean>; // from first request sent to last token returned
  loading: Readonly<boolean>; // loading state async API hit
}

export interface ChatRenameDialogData {
  inputDefaultValue: string | undefined;
}
