package chat

import (
	"context"
	"errors"
	"net/http"

	"github.com/mnabil1718/mcp-go/internal/commons"
	"github.com/mnabil1718/mcp-go/internal/llm"
	"github.com/mnabil1718/mcp-go/internal/message"
)

type ChatService struct {
	r  Repository
	mr message.Repository
	cl llm.LLMClient
}

func NewChatService(r Repository, mr message.Repository, cl llm.LLMClient) Service {
	return &ChatService{
		r:  r,
		mr: mr,
		cl: cl,
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

	queue := make(chan map[string]any, 10)
	errChan := make(chan error, 1)

	go func() {
		defer close(queue)
		defer close(errChan)
		var assistantResp string

		err := s.cl.Stream(context.Background(), payload, func(chunk llm.Chunk) error {

			// preprocessing here
			if msgObj, ok := chunk["message"].(map[string]any); ok {
				if content, ok := msgObj["content"].(string); ok {
					assistantResp += content
				}
			}

			// ollama can also return error chunk
			if errMsg, ok := chunk["error"].(string); ok {
				return errors.New(errMsg)
			}

			// non blocking
			select {
			case queue <- chunk:
				// chunk forwarded to SSE consumer
			default:
				// client disconnected / queue full, skip sending
			}

			return nil
		})

		if err != nil {
			errChan <- err
			return
		}

		if assistantResp != "" {
			if _, err := s.mr.SaveMessage(r.ChatID, assistantResp, message.MessageRoleAssistant); err != nil {
				errChan <- err
			}
		}

	}()

	if err = commons.HandleSseStreaming(ctx, w, queue, errChan); err != nil {
		return err
	}

	return nil
}
