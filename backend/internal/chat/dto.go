package chat

import (
	"time"

	"github.com/mnabil1718/mcp-go/internal/message"
)

type ControllerIdUriRequest struct {
	ID string `uri:"id" binding:"required,uuid"`
}

type ControllerPostMessageRequest struct {
	Message string `json:"message" binding:"required"`
}

type ControllerPatchTitleRequest struct {
	Title string `json:"title" binding:"required,max=80"`
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

type ServiceStreamRequest struct {
	ChatID string
	Model  string
}

type ServiceRenameRequest struct {
	ChatID string
	Title  string
}

type ServiceGenerateTitleRequest = ServiceStreamRequest
