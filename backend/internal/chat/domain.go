package chat

import (
	"time"

	"github.com/mnabil1718/mcp-go/internal/message"
)

type Chat struct {
	ID        string    `json:"id"`
	Title     *string   `json:"title,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

type ChatWithMessages struct {
	ID        string             `json:"id"`
	Title     *string            `json:"title,omitempty"`
	CreatedAt time.Time          `json:"created_at"`
	Messages  []*message.Message `json:"messages"`
}
