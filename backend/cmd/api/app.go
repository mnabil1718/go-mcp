package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/mnabil1718/mcp-go/internal/config"
)

type App struct {
	WG     sync.WaitGroup
	Config *config.Config
	Server *http.Server
	Router *gin.Engine
}

func NewApp() *App {
	return &App{
		Config: config.LoadConfig(),
		Router: gin.Default(),
	}
}

func (a *App) Start() error {
	a.WireDependencies()
	a.SetupServer()
	a.HandleGracefulShutdown()

	log.Printf("Starting server on port %d...\n", a.Config.Port)
	if err := a.Server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("server failed: %w", err)
	}

	return <-a.ShutdownChan()
}
