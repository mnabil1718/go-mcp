package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (app *Application) routes() http.Handler {
	r := gin.Default()

	r.GET("/health/liveness", app.healthcheck)
	r.POST("/chat", app.chat)

	return r.Handler()
}
