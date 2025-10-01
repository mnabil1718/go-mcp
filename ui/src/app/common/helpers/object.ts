import { Message, OllamaMessage } from '../../message/message.domain';

export function isMessage(obj: any): obj is Message {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'chat_id' in obj &&
    'sent_at' in obj &&
    'role' in obj &&
    'content' in obj
  );
}

export function isOllamaMessage(obj: any): obj is OllamaMessage {
  return (
    obj &&
    typeof obj === 'object' &&
    'role' in obj &&
    'content' in obj &&
    !('id' in obj) &&
    !('chat_id' in obj) &&
    !('sent_at' in obj)
  );
}
