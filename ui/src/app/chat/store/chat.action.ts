import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Chat, ChatWithMessages } from '../chat.domain';
import { Message, OllamaMessage } from '../../message/message.domain';

export const ChatActions = createActionGroup({
  source: 'Chats',
  events: {
    // user intent
    getChats: emptyProps(),
    getById: props<{ id: string }>(),
    createOptimistic: props<{ temp_id: string; prompt: string }>(),
    sendOptimistic: props<{ temp_id: string; chat_id: string; message: string }>(),
    saveMessageFromCreate: props<{ temp_id: string; chat_id: string; message: string }>(),
    generateTitle: props<{ id: string }>(),
    respond: props<{ id: string }>(),
  },
});

export const ChatAPIActions = createActionGroup({
  source: 'Chats API',
  events: {
    // API result
    createOptimisticSuccess: props<{ temp_id: string; chat: Chat }>(),
    generateTitleSuccess: props<Chat>(),
    getChatsSuccess: props<{ chats: Chat[] }>(),
    getByIdSuccess: props<ChatWithMessages>(),
    saveMessageSuccess: props<{ temp_id: string; message: Message }>(),
    respondStream: props<OllamaMessage>(),
    respondSuccess: props<Message>(),

    failure: props<{ message: string }>(),
  },
});
