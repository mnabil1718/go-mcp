package repository

import (
	"time"

	"github.com/google/uuid"
	"github.com/mnabil1718/mcp-go/internal/db"
	message_pkg "github.com/mnabil1718/mcp-go/internal/message"
)

type InMemoryRepository struct {
	db *db.InMemoryDB
}

func NewInMemoryRepository(db *db.InMemoryDB) message_pkg.Repository {
	return &InMemoryRepository{db: db}
}

func (r *InMemoryRepository) SaveMessage(chatID, message string, role message_pkg.Role) (*message_pkg.Message, error) {
	r.db.Mu.Lock()
	defer r.db.Mu.Unlock()

	id := uuid.NewString()
	msg := &message_pkg.Message{
		ID:      id,
		ChatID:  chatID,
		Role:    role,
		Content: message,
		SentAt:  time.Now(),
	}
	r.db.Messages[id] = msg

	return msg, nil
}
