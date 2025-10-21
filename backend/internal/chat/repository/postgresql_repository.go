package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/mnabil1718/mcp-go/internal/chat"
	"github.com/mnabil1718/mcp-go/internal/commons"
)

type PostgresqlRepository struct {
	db *sql.DB
}

func NewPostgresqlRepository(db *sql.DB) chat.Repository {
	return &PostgresqlRepository{db: db}
}

func (r *PostgresqlRepository) CheckIdExists(ctx context.Context, id string) error {
	SQL := `SELECT true FROM chats WHERE id = $1`
	args := []interface{}{id}
	var result bool

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	if err := r.db.QueryRowContext(ctx, SQL, args...).Scan(&result); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return commons.ErrRecordNotFound
		}

		return err
	}

	return nil
}

func (r *PostgresqlRepository) GetAll(ctx context.Context) ([]*chat.Chat, error) {
	SQL := `SELECT id, title, created_at FROM chats ORDER BY created_at DESC`

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	rows, err := r.db.QueryContext(ctx, SQL)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	chats := []*chat.Chat{}

	for rows.Next() {
		ch := &chat.Chat{}
		err := rows.Scan(&ch.ID, &ch.Title, &ch.CreatedAt)
		if err != nil {
			return nil, err
		}
		chats = append(chats, ch)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return chats, nil
}

func (r *PostgresqlRepository) Create(ctx context.Context) (*chat.Chat, error) {
	SQL := `INSERT INTO chats (id, created_at) VALUES ($1, $2)`
	ch := &chat.Chat{
		ID:        uuid.NewString(),
		Title:     nil,
		CreatedAt: time.Now(),
	}
	args := []interface{}{ch.ID, ch.CreatedAt}

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	if _, err := r.db.ExecContext(ctx, SQL, args...); err != nil {
		return nil, err
	}

	return ch, nil
}

func (r *PostgresqlRepository) UpdateTitle(ctx context.Context, id, title string) (*chat.Chat, error) {
	SQL := `UPDATE chats SET title = $1 WHERE id = $2 RETURNING created_at`
	ch := &chat.Chat{
		ID:    id,
		Title: &title,
	}
	args := []interface{}{*ch.Title, ch.ID}

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	if err := r.db.QueryRowContext(ctx, SQL, args...).Scan(&ch.CreatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, commons.ErrRecordNotFound
		}

		return nil, err
	}

	return ch, nil
}

func (r *PostgresqlRepository) GetById(ctx context.Context, id string) (*chat.ChatWithMessages, error) {
	SQL := `
					SELECT c.title, c.created_at,
					COALESCE( json_agg(
						json_build_object(
						'id', m.id,
						'chat_id', m.chat_id,
						'role', m.role,
						'content', m.content,
						'sent_at', m.sent_at
						) ORDER BY m.sent_at ASC
					), '[]') AS messages
					FROM chats c LEFT JOIN messages m 
					ON c.id = m.chat_id WHERE c.id = $1
					GROUP BY c.id
				 `
	args := []interface{}{id}
	cm := &chat.ChatWithMessages{ID: id}
	var msJSON []byte

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	if err := r.db.QueryRowContext(ctx, SQL, args...).Scan(
		&cm.Title, &cm.CreatedAt, &msJSON); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, commons.ErrRecordNotFound
		}

		return nil, err
	}

	if err := json.Unmarshal(msJSON, &cm.Messages); err != nil {
		return nil, err
	}

	return cm, nil
}

func (r *PostgresqlRepository) DeleteById(ctx context.Context, id string) error {
	SQL := `DELETE FROM chats WHERE id = $1`
	args := []interface{}{id}

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	if _, err := r.db.ExecContext(ctx, SQL, args...); err != nil {
		return err
	}

	return nil
}
