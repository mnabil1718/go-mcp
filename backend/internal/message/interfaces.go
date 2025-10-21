package message

import "context"

type Repository interface {
	SaveMessage(ctx context.Context, chatID, message string, role Role) (*Message, error)
}
