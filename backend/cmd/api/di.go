package main

import (
	"github.com/mnabil1718/mcp-go/internal/chat"
	cr "github.com/mnabil1718/mcp-go/internal/chat/repository"
	"github.com/mnabil1718/mcp-go/internal/db"
	"github.com/mnabil1718/mcp-go/internal/healthcheck"
	"github.com/mnabil1718/mcp-go/internal/llm"
	mr "github.com/mnabil1718/mcp-go/internal/message/repository"
)

func (a *App) WireDependencies() {
	db := db.NewInMemoryDB()

	// repo
	chatRepo := cr.NewMemoryRepository(db)
	msgRepo := mr.NewInMemoryRepository(db)

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
