package chat

import "time"

type ChatReq struct {
	ConvID  string `json:"conversation_id" binding:"required"`
	Message string `json:"message" binding:"required"`
}

type PostConvRes struct {
	ConvID string `json:"conversation_id"`
}

type Message struct {
	Role    string    `json:"role"`
	Content string    `json:"content"`
	SentAt  time.Time `json:"sent_at"`
}

type Conversation struct {
	ID        string    `json:"id"`
	Messages  []Message `json:"messages"`
	CreatedAt time.Time `json:"created_at"`
}

type Repository interface {
	GetConversations() []*Conversation
	CreateConversation() (string, error)
	GetConversation(id string) (*Conversation, error)
	SaveMessage(cID string, msg Message) error
}
