package data

import "github.com/mnabil1718/mcp-go/internal/chat"

type Repos struct {
	ChatRepo chat.Repository
}

func NewRepos() *Repos {
	return &Repos{ChatRepo: chat.NewMemoryRepo()}
}
