import { createReducer, on } from '@ngrx/store';
import { ChatState, ChatWithMessages } from '../chat.domain';
import { ChatActions, ChatAPIActions } from './chat.action';

export const initState: ChatState = {
  chats: [],
  messages: [],
  selectedChatId: null,
  thinking: false,
  response: null,
  generating: false,
};

export const chatsReducer = createReducer(
  initState,

  on(ChatActions.createOptimistic, (state, { temp_id, prompt }) => ({
    ...state,
    chats: [
      ...state.chats,
      {
        id: temp_id,
        created_at: new Date().toISOString(),
      },
    ],
    selectedChatId: temp_id,
    messages: [
      {
        id: temp_id,
        chat_id: temp_id,
        content: prompt,
        role: 'user',
        sent_at: new Date().toISOString(),
      },
    ],
    thinking: true,
    generating: true,
  })),

  on(ChatActions.sendOptimistic, (state, { temp_id, chat_id, message }) => ({
    ...state,
    messages: [
      ...state.messages,
      {
        id: temp_id,
        chat_id,
        role: 'user',
        content: message,
        sent_at: new Date().toISOString(),
      },
    ],
    thinking: true,
    generating: true,
  })),

  on(ChatActions.respond, (state, _) => ({
    ...state,
    generating: true,
    thinking: true,
  })),

  // API

  on(ChatAPIActions.getChatsSuccess, (state, { chats }) => ({
    ...state,
    chats,
  })),

  on(ChatAPIActions.createOptimisticSuccess, (state, { temp_id, chat }) => ({
    ...state,
    chats: state.chats.map((ch) => (ch.id === temp_id ? chat : ch)),
    selectedChatId: chat.id,
    messages: state.messages.map((msg) =>
      msg.chat_id === temp_id ? { ...msg, chat_id: chat.id } : msg
    ),
  })),

  on(ChatAPIActions.generateTitleSuccess, (state, chat) => ({
    ...state,
    chats: state.chats.map((ch) => (ch.id === chat.id ? chat : ch)),
  })),

  on(ChatAPIActions.getByIdSuccess, (state, chatWithMessages) => ({
    ...state,
    selectedChatId: chatWithMessages.id,
    messages: chatWithMessages.messages,
  })),

  on(ChatAPIActions.saveMessageSuccess, (state, { temp_id, message }) => ({
    ...state,
    messages: state.messages.map((msg) => (msg.id === temp_id ? message : msg)),
  })),

  on(ChatAPIActions.respondStream, (state, chunk) => ({
    ...state,
    thinking: false,
    response: (state.response ?? '') + chunk.content,
  })),

  on(ChatAPIActions.respondSuccess, (state, message) => ({
    ...state,
    response: null,
    messages: [...state.messages, message],
    generating: false,
  }))
);
