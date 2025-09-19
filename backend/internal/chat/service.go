package chat

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

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

func (s *ChatService) SaveMessage(chatID, message string, role message.Role) error {
	if err := s.mr.SaveMessage(chatID, message, role); err != nil {
		return err
	}

	return nil
}

func (s *ChatService) StreamChat(ctx context.Context, w http.ResponseWriter, r ServiceStreamChatRequest) error {
	ch, err := s.r.GetById(r.ChatID)
	if err != nil {
		return err
	}

	// Save user message
	if err := s.mr.SaveMessage(ch.ID, r.UserMsg, message.MessageRoleUser); err != nil {
		return err
	}

	// Prepare messages for backend
	messages := make([]map[string]any, 0, len(ch.Messages)+1)
	for _, m := range ch.Messages {
		messages = append(messages, map[string]any{
			"role":    m.Role,
			"content": m.Content,
		})
	}
	messages = append(messages, map[string]any{
		"role":    message.MessageRoleUser,
		"content": r.UserMsg,
	})

	payload := map[string]any{
		"model":    r.Model,
		"messages": messages,
		"stream":   true,
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal request payload: %w", err)
	}

	resp, err := http.Post(r.Endpoint, "application/json", bytes.NewBuffer(data))
	if err != nil {
		return fmt.Errorf("failed to reach chat backend: %w", err)
	}
	defer resp.Body.Close()

	// Setup SSE headers
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
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
				return fmt.Errorf("invalid response from chat backend: %w", err)
			}

			// Extract assistant message content
			if msgObj, ok := chunk["message"].(map[string]any); ok {
				if content, ok := msgObj["content"].(string); ok {
					assistantResp += content
				}
			}

			// Stream raw chunk to client
			b, _ := json.Marshal(chunk)
			fmt.Fprintf(w, "data: %s\n\n", b)
			flusher.Flush()

			// Save final assistant response when done
			if done, ok := chunk["done"].(bool); ok && done {
				if assistantResp != "" {
					_ = s.mr.SaveMessage(ch.ID, assistantResp, message.MessageRoleAssistant)
				}
				return nil
			}
		}
	}
}
