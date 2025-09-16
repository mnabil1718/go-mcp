package chat

import (
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/mnabil1718/mcp-go/internal/commons"
)

type MemoryRepo struct {
	mu    sync.RWMutex
	convs map[string]*Conversation
}

func NewMemoryRepo() *MemoryRepo {
	return &MemoryRepo{convs: make(map[string]*Conversation)}
}

func (r *MemoryRepo) GetConversations() []*Conversation {
	r.mu.RLock()
	defer r.mu.RUnlock()

	conversations := []*Conversation{}

	for _, conv := range r.convs {
		conversations = append(conversations, conv)
	}

	return conversations
}

func (r *MemoryRepo) CreateConversation() (string, error) {
	id := uuid.NewString()
	r.mu.Lock()
	defer r.mu.Unlock()

	r.convs[id] = &Conversation{ID: id, Messages: []Message{}, CreatedAt: time.Now()}

	return id, nil
}

func (r *MemoryRepo) GetConversation(id string) (*Conversation, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	conv, ok := r.convs[id]
	if !ok {
		return nil, commons.ErrRecordNotFound
	}

	return conv, nil
}

func (r *MemoryRepo) SaveMessage(cID string, msg Message) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	conv, ok := r.convs[cID]
	if !ok {
		return commons.ErrRecordNotFound
	}

	conv.Messages = append(conv.Messages, msg)
	return nil
}
