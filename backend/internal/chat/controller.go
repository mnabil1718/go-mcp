package chat

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mnabil1718/mcp-go/internal/commons"
	"github.com/mnabil1718/mcp-go/internal/config"
)

type ChatController struct {
	s   Service
	cfg *config.Config
}

func NewChatController(s Service, cfg *config.Config) Controller {
	return &ChatController{s: s, cfg: cfg}
}

func (cr *ChatController) Post(c *gin.Context) {
	var req ControllerCreateChatRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		commons.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	ch, err := cr.s.Create(req.Title)
	if err != nil {
		commons.TranslateDomainError(c, err)
		return
	}

	commons.SuccessResponse(c, http.StatusCreated, nil, ch)
}

func (cr *ChatController) GetAll(c *gin.Context) {
	chats, err := cr.s.GetAll()
	if err != nil {
		commons.TranslateDomainError(c, err)
		return
	}

	commons.SuccessResponse(c, http.StatusOK, nil, chats)
}

func (cr *ChatController) GetById(c *gin.Context) {
	var req ControllerGetByIdRequest
	if err := c.ShouldBindUri(&req); err != nil {
		commons.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	chat, err := cr.s.GetById(c.Param("id"))
	if err != nil {
		commons.TranslateDomainError(c, err)
		return
	}

	commons.SuccessResponse(c, http.StatusOK, nil, chat)
}

func (cr *ChatController) PostChat(c *gin.Context) {
	var req ControllerChatRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		commons.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	r := ServiceStreamChatRequest{
		ChatID:   req.ID,
		UserMsg:  req.Message,
		Model:    "mistral:latest",
		Endpoint: cr.cfg.ChatEndpoint,
	}

	err := cr.s.StreamChat(
		c.Request.Context(),
		c.Writer,
		r,
	)
	if err != nil {
		commons.TranslateDomainError(c, err)
	}
}
