import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from '../chat.domain';

export const selectChatState = createFeatureSelector<ChatState>('chat');
export const selectChats = createSelector(selectChatState, (state) => state.chats);
export const selectSelectedChatId = createSelector(
  selectChatState,
  (state) => state.selectedChatId
);
export const selectMessages = createSelector(selectChatState, (state) => state.messages);
export const selectResponse = createSelector(selectChatState, (state) => state.response);
export const selectThinking = createSelector(selectChatState, (state) => state.thinking);
export const selectGenerating = createSelector(selectChatState, (state) => state.generating);
export const selectSelectedChat = createSelector(
  selectChats,
  selectSelectedChatId,
  (chats, selectedChatId) =>
    selectedChatId ? chats.find((ch) => ch.id === selectedChatId) ?? null : null
);
