import { Message } from '../message/message.domain';

export interface Chat {
  id: string;
  title: string;
  created_at: string;
}

export interface ChatWithMessages {
  id: string;
  title: string;
  created_at: string;
  messages: Message[];
}

export interface CreateChatRequest {
  title: string;
}

export interface SaveMessageRequest {
  chat_id: string;
  message: string;
}
