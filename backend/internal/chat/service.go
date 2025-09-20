package chat

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/mnabil1718/mcp-go/internal/message"
)

type ChatService struct {
	r  Repository
	mr message.Repository
}

func NewChatService(r Repository, mr message.Repository) Service {
	return &ChatService{
		r:  r,
		mr: mr,
	}
}

func (s *ChatService) Create(title string) (*Chat, error) {
	ch, err := s.r.Create(title)
	if err != nil {
		return nil, err
	}

	return ch, nil
}

func (s *ChatService) GetAll() ([]*Chat, error) {
	chats, err := s.r.GetAll()
	if err != nil {
		return nil, err
	}

	return chats, nil
}

func (s *ChatService) GetById(id string) (*ChatWithMessages, error) {
	res, err := s.r.GetById(id)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (s *ChatService) SaveMessage(chatID, message string, role message.Role) (*message.Message, error) {
	msg, err := s.mr.SaveMessage(chatID, message, role)
	if err != nil {
		return nil, err
	}

	return msg, err
}

func (s *ChatService) Stream(ctx context.Context, w http.ResponseWriter, r ServiceStreamRequest) error {
	ch, err := s.r.GetById(r.ChatID)
	if err != nil {
		return err
	}

	// Prepare chat history context
	messages := make([]map[string]any, 0, len(ch.Messages))
	for _, m := range ch.Messages {
		messages = append(messages, map[string]any{
			"role":    m.Role,
			"content": m.Content,
		})
	}

	payload := map[string]any{
		"model":    r.Model,
		"messages": messages,
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal request payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", r.Endpoint, bytes.NewBuffer(data))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{
		Timeout: 60 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to reach chat backend: %w", err)
	}
	defer resp.Body.Close()

	// Setup SSE headers
	w.Header().Set("Content-Type", "text/event-stream; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache, no-transform")
	w.Header().Set("Connection", "keep-alive")

	flusher, ok := w.(http.Flusher)
	if !ok {
		return fmt.Errorf("streaming not supported")
	}

	dec := json.NewDecoder(resp.Body)
	var assistantResp string

	for {
		select {
		case <-ctx.Done():
			// client closed connection
			return nil
		default:
			var chunk map[string]any
			if err := dec.Decode(&chunk); err != nil {
				if errors.Is(err, io.EOF) {
					return nil
				}

				// Stream error event before closing
				fmt.Fprintf(w, "event: error\ndata: %q\n\n", err.Error())
				flusher.Flush()
				return fmt.Errorf("invalid response from chat backend: %w", err)
			}

			// Extract assistant message content
			if msgObj, ok := chunk["message"].(map[string]any); ok {
				if content, ok := msgObj["content"].(string); ok {
					assistantResp += content

					// Stream message event
					b, _ := json.Marshal(map[string]any{
						"role":    "assistant",
						"content": content,
					})
					fmt.Fprintf(w, "event: message\ndata: %s\n\n", b)
					flusher.Flush()
				}
			}

			// Save final assistant response when done
			if done, ok := chunk["done"].(bool); ok && done {
				if assistantResp != "" {
					_, _ = s.mr.SaveMessage(ch.ID, assistantResp, message.MessageRoleAssistant)
				}

				// Send final "done" event
				fmt.Fprintf(w, "event: done\ndata: {\"done\":true}\n\n")
				flusher.Flush()

				return nil
			}
		}
	}
}
