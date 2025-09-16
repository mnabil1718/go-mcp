package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (app *Application) routes() http.Handler {
	r := gin.Default()

	useMiddlewares(r)

	r.GET("/health/liveness", app.healthcheck)
	r.GET("/conversations/:id", app.getConv)
	r.POST("/conversations", app.postConv)
	r.GET("/conversations", app.getConvs)
	r.POST("/chat", app.postChat)

	return r.Handler()
}
