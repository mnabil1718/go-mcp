package message

import (
	"time"
)

type Role string

const (
	MessageRoleUser      Role = "user"
	MessageRoleAssistant Role = "assistant"
	MessageRoleSystem    Role = "system"
)

type Message struct {
	ID      string    `json:"id"`
	ChatID  string    `json:"chat_id"`
	Role    Role      `json:"role"`
	Content string    `json:"content"`
	SentAt  time.Time `json:"sent_at"`
}
