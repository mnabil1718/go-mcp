import { createReducer, on } from '@ngrx/store';
import { ChatState, ChatWithMessages } from '../chat.domain';
import { ChatActions, ChatAPIActions } from './chat.action';

export const initState: ChatState = {
  chats: [],
  messages: [],
  selectedChatId: null,
  thinking: false,
  generating: false,
  loading: false,
};

export const chatsReducer = createReducer(
  initState,

  on(ChatActions.getChats, (state) => ({
    ...state,
    loading: true,
  })),

  on(ChatActions.createOptimistic, (state, { temp_id, prompt }) => ({
    ...state,
    chats: [
      {
        id: temp_id,
        title: 'New Chat',
        created_at: new Date().toISOString(),
      },
      ...state.chats,
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

  on(ChatActions.getById, (state) => ({
    ...state,
    loading: true,
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

  on(ChatActions.respond, (state, { id, temp_id }) => ({
    ...state,
    generating: true,
    thinking: true,
    messages: [
      ...state.messages,
      {
        id: temp_id,
        chat_id: id,
        role: 'assistant',
        sent_at: new Date().toISOString(),
        content: '',
      },
    ],
  })),

  // API

  on(ChatAPIActions.getChatsSuccess, (state, { chats }) => ({
    ...state,
    chats,
    loading: false,
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
    loading: false,
  })),

  on(ChatAPIActions.saveMessageSuccess, (state, { temp_id, message }) => ({
    ...state,
    messages: state.messages.map((msg) => (msg.id === temp_id ? message : msg)),
  })),

  on(ChatAPIActions.respondStream, (state, props) => ({
    ...state,
    thinking: false,
    messages: state.messages.map((m) => {
      if (m.id === props.temp_id) {
        // update content
        return { ...m, content: m.content + props.chunk.content };
      }

      return m;
    }),
  })),

  on(ChatAPIActions.respondSuccess, (state, props) => ({
    ...state,
    response: null,
    messages: state.messages.map((m) => {
      // prevent UI from re-render scroll position
      if (m.id === props.temp_id) {
        return {
          ...m,
          sent_at: props.message.sent_at,
          content: props.message.content,
        };
      }

      return m;
    }),
    generating: false,
  })),

  on(ChatAPIActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
);
