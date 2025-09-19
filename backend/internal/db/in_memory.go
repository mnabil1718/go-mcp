package db

import (
	"sync"

	"github.com/mnabil1718/mcp-go/internal/chat"
	"github.com/mnabil1718/mcp-go/internal/message"
)

type InMemoryDB struct {
	Mu       sync.RWMutex
	Chats    map[string]*chat.Chat
	Messages map[string]*message.Message
}

func NewInMemoryDB() *InMemoryDB {
	return &InMemoryDB{
		Chats:    make(map[string]*chat.Chat),
		Messages: make(map[string]*message.Message),
	}
}
