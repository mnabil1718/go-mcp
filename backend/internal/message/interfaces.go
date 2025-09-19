package message

type Repository interface {
	SaveMessage(chatID, message string, role Role) error
}
