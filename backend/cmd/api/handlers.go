package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mnabil1718/mcp-go/internal/chat"
	"github.com/mnabil1718/mcp-go/internal/commons"
)

func (app *Application) healthcheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "alive"})
}

func (app *Application) postConv(c *gin.Context) {
	convID, err := app.repos.ChatRepo.CreateConversation()
	if err != nil {
		commons.TranslateDomainError(c, err)
		return
	}

	commons.SuccessResponse(c, http.StatusCreated, nil, chat.PostConvRes{ConvID: convID})
}

func (app *Application) postChat(c *gin.Context) {
	var req chat.ChatReq

	if err := c.ShouldBindJSON(&req); err != nil {
		commons.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	conv, err := app.repos.ChatRepo.GetConversation(req.ConvID)
	if err != nil {
		commons.TranslateDomainError(c, err)
		return
	}

	// Save user message
	if err := app.repos.ChatRepo.SaveMessage(req.ConvID, chat.Message{
		Role:    "user",
		Content: req.Message,
	}); err != nil {
		commons.TranslateDomainError(c, err)
		return
	}

	// Prepare messages for backend
	messages := make([]map[string]any, 0, len(conv.Messages))
	for _, m := range conv.Messages {
		messages = append(messages, map[string]any{
			"role":    m.Role,
			"content": m.Content,
		})
	}

	payload := map[string]any{
		"model":    "mistral:latest",
		"messages": messages,
	}

	data, err := json.Marshal(payload)
	if err != nil {
		commons.ErrorResponse(c, http.StatusInternalServerError, "failed to marshal request payload")
		return
	}

	resp, err := http.Post(app.config.ChatEndpoint, "application/json", bytes.NewBuffer(data))
	if err != nil {
		commons.ErrorResponse(c, http.StatusBadGateway, "failed to reach chat backend")
		return
	}
	defer resp.Body.Close()

	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")
	c.Status(http.StatusOK)

	flusher, ok := c.Writer.(http.Flusher)
	if !ok {
		commons.ErrorResponse(c, http.StatusInternalServerError, "streaming not supported")
		return
	}

	dec := json.NewDecoder(resp.Body)
	ctx := c.Request.Context()
	var assistantResp string

	for {
		select {
		case <-ctx.Done():
			// client closed connection
			return
		default:
			var chunk map[string]any
			if err := dec.Decode(&chunk); err != nil {
				if errors.Is(err, io.EOF) {
					return
				}
				commons.ErrorResponse(c, http.StatusBadGateway, "invalid response from chat backend")
				return
			}

			// ✅ Extract assistant message content
			if msgObj, ok := chunk["message"].(map[string]any); ok {
				if content, ok := msgObj["content"].(string); ok {
					assistantResp += content
				}
			}

			// stream raw chunk to client
			b, _ := json.Marshal(chunk)
			fmt.Fprintf(c.Writer, "data: %s\n\n", b)
			flusher.Flush()

			// ✅ Save final assistant response on "done"
			if done, ok := chunk["done"].(bool); ok && done {
				if assistantResp != "" {
					_ = app.repos.ChatRepo.SaveMessage(req.ConvID, chat.Message{
						Role:    "assistant",
						Content: assistantResp,
					})
				}
				return
			}
		}
	}
}

func (app *Application) getConv(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		commons.ErrorResponse(c, http.StatusBadRequest, "conversation id invalid")
	}

	conv, err := app.repos.ChatRepo.GetConversation(id)
	if err != nil {
		commons.TranslateDomainError(c, err)
		return
	}

	commons.SuccessResponse(c, http.StatusOK, nil, conv)
}
