export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  sent_at: string;
}

export interface OllamaMessage {
  role: 'user' | 'assistant';
  content: string;
}
