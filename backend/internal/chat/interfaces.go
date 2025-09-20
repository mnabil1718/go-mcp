package chat

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mnabil1718/mcp-go/internal/message"
)

type Controller interface {
	Post(c *gin.Context)
	GetAll(c *gin.Context)
	GetById(c *gin.Context)
	PostMessage(c *gin.Context)
	GetStream(c *gin.Context)
}

type Service interface {
	GetAll() ([]*Chat, error)
	Create(title string) (*Chat, error)
	GetById(id string) (*ChatWithMessages, error)
	SaveMessage(chatID, message string, role message.Role) (*message.Message, error)
	Stream(ctx context.Context, w http.ResponseWriter, r ServiceStreamRequest) error
}

type Repository interface {
	GetAll() ([]*Chat, error)
	Create(title string) (*Chat, error)
	GetById(id string) (*ChatWithMessages, error)
}
