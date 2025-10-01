package repository

import (
	"sort"
	"time"

	"github.com/google/uuid"
	"github.com/mnabil1718/mcp-go/internal/chat"
	"github.com/mnabil1718/mcp-go/internal/commons"
	"github.com/mnabil1718/mcp-go/internal/db"
	"github.com/mnabil1718/mcp-go/internal/message"
)

type InMemoryRepository struct {
	db *db.InMemoryDB
}

func NewMemoryRepository(db *db.InMemoryDB) chat.Repository {
	return &InMemoryRepository{db: db}
}

func (r *InMemoryRepository) CheckIdExists(id string) error {
	r.db.Mu.RLock()
	defer r.db.Mu.RUnlock()

	if _, ok := r.db.Chats[id]; !ok {
		return commons.ErrRecordNotFound
	}

	return nil
}

func (r *InMemoryRepository) GetAll() ([]*chat.Chat, error) {
	r.db.Mu.RLock()
	defer r.db.Mu.RUnlock()

	chats := []*chat.Chat{}

	for _, chat := range r.db.Chats {
		chats = append(chats, chat)
	}

	sort.Slice(chats, func(i, j int) bool {
		return chats[i].CreatedAt.After(chats[j].CreatedAt)
	})

	return chats, nil
}

func (r *InMemoryRepository) Create() (*chat.Chat, error) {
	r.db.Mu.Lock()
	defer r.db.Mu.Unlock()

	id := uuid.NewString()

	ch := &chat.Chat{
		ID:        id,
		Title:     nil, // generated after first AI response
		CreatedAt: time.Now(),
	}

	r.db.Chats[id] = ch

	return ch, nil
}

func (r *InMemoryRepository) UpdateTitle(id, title string) (*chat.Chat, error) {
	r.db.Mu.Lock()
	defer r.db.Mu.Unlock()

	ch, ok := r.db.Chats[id]
	if !ok {
		return nil, commons.ErrRecordNotFound
	}

	updated := &chat.Chat{
		ID:        ch.ID,
		Title:     &title,
		CreatedAt: ch.CreatedAt,
	}

	r.db.Chats[id] = updated

	return updated, nil

}

func (r *InMemoryRepository) GetById(id string) (*chat.ChatWithMessages, error) {
	r.db.Mu.RLock()
	defer r.db.Mu.RUnlock()

	ch, ok := r.db.Chats[id]
	if !ok {
		return nil, commons.ErrRecordNotFound
	}

	messages := []*message.Message{}
	for _, msg := range r.db.Messages {
		if msg.ChatID == id {
			messages = append(messages, msg)
		}
	}

	sort.Slice(messages, func(i, j int) bool {
		return messages[i].SentAt.Before(messages[j].SentAt)
	})

	res := &chat.ChatWithMessages{
		ID:        ch.ID,
		Title:     ch.Title,
		CreatedAt: ch.CreatedAt,
		Messages:  messages,
	}

	return res, nil
}
