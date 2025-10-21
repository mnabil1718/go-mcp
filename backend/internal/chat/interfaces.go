package chat

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mnabil1718/mcp-go/internal/message"
)

type Controller interface {
	Post(c *gin.Context)
	Delete(c *gin.Context)
	PostTitle(c *gin.Context)
	PatchTitle(c *gin.Context)
	GetAll(c *gin.Context)
	GetById(c *gin.Context)
	PostMessage(c *gin.Context)
	GetStream(c *gin.Context)
}

type Service interface {
	GetAll(ctx context.Context) ([]*Chat, error)
	Create(ctx context.Context) (*Chat, error)
	GetById(ctx context.Context, id string) (*ChatWithMessages, error)
	Delete(ctx context.Context, id string) error
	Rename(ctx context.Context, r ServiceRenameRequest) (*Chat, error)
	GenerateTitle(ctx context.Context, r ServiceGenerateTitleRequest) (*Chat, error)
	SaveMessage(ctx context.Context, chatID, message string, role message.Role) (*message.Message, error)
	Stream(ctx context.Context, w http.ResponseWriter, r ServiceStreamRequest) error
}

type Repository interface {
	GetAll(ctx context.Context) ([]*Chat, error)
	Create(ctx context.Context) (*Chat, error)
	DeleteById(ctx context.Context, id string) error
	CheckIdExists(ctx context.Context, id string) error
	UpdateTitle(ctx context.Context, id, title string) (*Chat, error)
	GetById(ctx context.Context, id string) (*ChatWithMessages, error)
}
