import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from '../chat.domain';

export const selectChatState = createFeatureSelector<ChatState>('chat');
export const selectChats = createSelector(selectChatState, (state) => state.chats);
export const selectSelectedChatId = createSelector(
  selectChatState,
  (state) => state.selectedChatId
);
export const selectMessages = createSelector(selectChatState, (state) => state.messages);
export const selectThinking = createSelector(selectChatState, (state) => state.thinking);
export const selectGenerating = createSelector(selectChatState, (state) => state.generating);
export const selectLoading = createSelector(selectChatState, (state) => state.loading);
export const selectSelectedChat = createSelector(
  selectChats,
  selectSelectedChatId,
  (chats, selectedChatId) =>
    selectedChatId ? chats.find((ch) => ch.id === selectedChatId) ?? null : null
);

export const selectChatTitle = (id: string) =>
  createSelector(selectChats, (cs) => {
    for (const c of cs) {
      if (c.id === id) {
        return c.title;
      }
    }

    return null;
  });
