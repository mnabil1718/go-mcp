export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sent_at: string; // ISO date
}

export interface Conversation {
  id: string;
  created_at: string;
  messages: Message[];
}

export interface PostConvRes {
  conversation_id: string;
}
