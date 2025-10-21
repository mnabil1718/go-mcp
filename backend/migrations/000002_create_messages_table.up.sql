CREATE TYPE message_role AS ENUM (
  'system',
  'user',
  'assistant'
);
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE ON UPDATE CASCADE,
  role message_role NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_messages_chat_sent ON messages (chat_id, sent_at);