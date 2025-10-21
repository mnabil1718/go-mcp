package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/google/uuid"
	message_pkg "github.com/mnabil1718/mcp-go/internal/message"
)

type PostgresqlRepository struct {
	db *sql.DB
}

func NewPostgresqlRepository(db *sql.DB) message_pkg.Repository {
	return &PostgresqlRepository{db: db}
}

func (r *PostgresqlRepository) SaveMessage(ctx context.Context, chatID, message string, role message_pkg.Role) (*message_pkg.Message, error) {
	fmt.Println("message in mr", message)
	SQL := `INSERT INTO messages (id, chat_id, role, content, sent_at) VALUES ($1, $2, $3, $4, $5)`
	msg := &message_pkg.Message{
		ID:      uuid.NewString(),
		ChatID:  chatID,
		Role:    role,
		Content: message,
		SentAt:  time.Now(),
	}
	args := []interface{}{msg.ID, msg.ChatID, msg.Role, msg.Content, msg.SentAt}

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	if _, err := r.db.ExecContext(ctx, SQL, args...); err != nil {
		fmt.Println(err)
		return nil, err
	}

	return msg, nil
}
