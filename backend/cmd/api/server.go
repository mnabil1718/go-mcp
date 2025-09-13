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

func (app *Application) serve() error {
	server := &http.Server{Addr: fmt.Sprintf(":%d", app.config.Port), Handler: app.routes()}
	shutDownErr := make(chan error, 1)

	go app.gracefulShutdown(server, shutDownErr)

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("listen: %s\n", err)
	}

	if err := <-shutDownErr; err != nil {
		return err
	}

	return nil
}

func (app *Application) gracefulShutdown(server *http.Server, shutDownErr chan error) {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		shutDownErr <- err
	}

	app.wg.Wait()
	shutDownErr <- nil
}
