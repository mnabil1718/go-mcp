package main

import (
	"log"

	"github.com/mnabil1718/mcp-go/internal/chat"
	cr "github.com/mnabil1718/mcp-go/internal/chat/repository"
	"github.com/mnabil1718/mcp-go/internal/db"
	"github.com/mnabil1718/mcp-go/internal/healthcheck"
	"github.com/mnabil1718/mcp-go/internal/llm"
	mr "github.com/mnabil1718/mcp-go/internal/message/repository"
)

func (a *App) WireDependencies() {
	db, err := db.NewPool(*a.Config)
	if err != nil {
		log.Fatalf("failed to initialize database: %v", err)
	}

	// repo
	chatRepo := cr.NewPostgresqlRepository(db)
	msgRepo := mr.NewPostgresqlRepository(db)

	// llm client
	llmClient := llm.NewOllamaClient(a.Config.LLMApiEndpoint)

	// service
	chatService := chat.NewChatService(chatRepo, msgRepo, llmClient)

	// controller
	healthcheckController := healthcheck.NewHealthcheckController()
	chatController := chat.NewChatController(chatService, a.Config)

	// middlewares & register routes
	UseGlobalMiddlewares(a.Router)
	healthcheck.RegisterRoutes(a.Router, healthcheckController)
	chat.RegisterRoutes(a.Router, chatController)
}
