package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mnabil1718/mcp-go/internal/chat"
)

func (app *Application) healthcheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "alive"})
}

func (app *Application) chat(c *gin.Context) {
	var req chat.ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	payload := gin.H{
		"model": "mistral:latest",
		"messages": []map[string]any{
			{
				"role":    "user",
				"content": req.Message,
			},
		},
	}

	data, err := json.Marshal(payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	resp, err := http.Post(app.config.ChatEndpoint, "application/json", bytes.NewBuffer(data))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer resp.Body.Close()

	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")

	dec := json.NewDecoder(resp.Body)

	for {
		var chunk map[string]any
		if err = dec.Decode(&chunk); err != nil {
			break
		}

		b, _ := json.Marshal(chunk)
		c.Writer.Write([]byte(fmt.Sprintf("data: %s \n\n", b)))
		c.Writer.Flush()

		if done, ok := chunk["done"].(bool); ok && done {
			break
		}
	}
}
