package main

import (
	"log"
	"sync"

	"github.com/mnabil1718/mcp-go/internal/config"
)

type Application struct {
	config *config.Config
	wg     sync.WaitGroup
}

func main() {
	app := &Application{
		config: config.LoadConfig(),
	}

	if err := app.serve(); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
