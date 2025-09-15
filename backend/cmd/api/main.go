package main

import (
	"log"
	"sync"

	"github.com/mnabil1718/mcp-go/internal/config"
	"github.com/mnabil1718/mcp-go/internal/data"
)

type Application struct {
	repos  *data.Repos
	config *config.Config
	wg     sync.WaitGroup
}

func main() {
	app := &Application{
		config: config.LoadConfig(),
		repos:  data.NewRepos(),
	}

	if err := app.serve(); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
