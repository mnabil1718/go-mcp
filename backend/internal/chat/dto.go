package chat

import (
	"time"

	"github.com/mnabil1718/mcp-go/internal/message"
)

type ControllerGetByIdRequest struct {
	ID string `uri:"id" binding:"required,uuid"`
}

type ControllerChatRequest struct {
	ID      string `json:"chat_id" binding:"required"`
	Message string `json:"message" binding:"required"`
}

type ControllerCreateChatRequest struct {
	Title string `json:"title" binding:"required,min=1"`
}

type ServiceGetByIDResponse struct {
	ID        string            `json:"id"`
	Title     string            `json:"title"`
	CreatedAt time.Time         `json:"created_at"`
	Messages  []message.Message `json:"messages"`
}

type ServiceStreamChatRequest struct {
	ChatID   string
	UserMsg  string
	Model    string
	Endpoint string
}
