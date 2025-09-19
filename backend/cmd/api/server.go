package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func (a *App) SetupServer() {
	a.Server = &http.Server{
		Addr:    fmt.Sprintf(":%d", a.Config.Port),
		Handler: a.Router.Handler(),
	}
}

func (a *App) HandleGracefulShutdown() {
	a.WG.Add(1)
	go func() {
		defer a.WG.Done()
		a.GracefulShutdown()
	}()
}

func (a *App) GracefulShutdown() {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Received shutdown signal")

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	if err := a.Server.Shutdown(ctx); err != nil {
		log.Printf("server shutdown failed: %v", err)
	}
}

func (a *App) ShutdownChan() <-chan error {
	done := make(chan error)
	go func() {
		a.WG.Wait()
		done <- nil
	}()
	return done
}
