package main

import "github.com/gin-gonic/gin"

func (app *Application) healthcheck(c *gin.Context) {
	c.JSON(200, gin.H{"status": "alive"})
}
