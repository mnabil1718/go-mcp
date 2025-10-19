package chat

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mnabil1718/mcp-go/internal/commons"
	"github.com/mnabil1718/mcp-go/internal/config"
	"github.com/mnabil1718/mcp-go/internal/llm"
	"github.com/mnabil1718/mcp-go/internal/message"
)

type ChatController struct {
	s   Service
	cfg *config.Config
}

func NewChatController(s Service, cfg *config.Config) Controller {
	return &ChatController{s: s, cfg: cfg}
}

func (cr *ChatController) Post(c *gin.Context) {

	ch, err := cr.s.Create()
	if err != nil {
		commons.TranslateDomainError(c, err)
		return
	}

	commons.SuccessResponse(c, http.StatusCreated, nil, ch)
}

func (cr *ChatController) PostTitle(c *gin.Context) {
	var param ControllerIdUriRequest
	if err := c.ShouldBindUri(&param); err != nil {
		commons.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	r := ServiceGenerateTitleRequest{
		ChatID: param.ID,
		Model:  llm.Llama3,
	}
	ch, err := cr.s.GenerateTitle(c.Request.Context(), r)
	if err != nil {
		commons.TranslateDomainError(c, err)
		return
	}

	commons.SuccessResponse(c, http.StatusOK, nil, ch)
}

func (cr *ChatController) PatchTitle(c *gin.Context) {
	var param ControllerIdUriRequest
	if err := c.ShouldBindUri(&param); err != nil {
		commons.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	var req ControllerPatchTitleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		commons.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	r := ServiceRenameRequest{
		ChatID: param.ID,
		Title:  req.Title,
	}
	ch, err := cr.s.Rename(r)
	if err != nil {
		commons.TranslateDomainError(c, err)
		return
	}

	commons.SuccessResponse(c, http.StatusOK, nil, ch)
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
	var req ControllerIdUriRequest
	if err := c.ShouldBindUri(&req); err != nil {
		commons.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	chat, err := cr.s.GetById(req.ID)
	if err != nil {
		commons.TranslateDomainError(c, err)
		return
	}

	commons.SuccessResponse(c, http.StatusOK, nil, chat)
}

func (cr *ChatController) PostMessage(c *gin.Context) {
	var rUri ControllerIdUriRequest
	if err := c.ShouldBindUri(&rUri); err != nil {
		commons.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	var req ControllerPostMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		commons.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	msg, err := cr.s.SaveMessage(rUri.ID, req.Message, message.MessageRoleUser)
	if err != nil {
		commons.TranslateDomainError(c, err)
		return
	}

	commons.SuccessResponse(c, http.StatusCreated, nil, msg)
}

func (cr *ChatController) GetStream(c *gin.Context) {
	var req ControllerIdUriRequest
	if err := c.ShouldBindUri(&req); err != nil {
		commons.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	r := ServiceStreamRequest{
		ChatID: req.ID,
		Model:  llm.Llama3,
	}

	err := cr.s.Stream(
		c.Request.Context(),
		c.Writer,
		r,
	)
	if err != nil {
		commons.TranslateDomainError(c, err)
	}
}

func (cr *ChatController) Delete(c *gin.Context) {
	var req ControllerIdUriRequest
	if err := c.ShouldBindUri(&req); err != nil {
		commons.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := cr.s.Delete(req.ID); err != nil {
		commons.TranslateDomainError(c, err)
		return
	}

	commons.SuccessResponse(c, http.StatusOK, commons.ToSPtr("chat deleted succesfully"), nil)
}
