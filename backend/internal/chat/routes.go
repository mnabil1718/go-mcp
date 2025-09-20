package chat

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine, controller Controller) {
	r.GET("/chats/:id", controller.GetById)
	r.POST("/chats", controller.Post)
	r.GET("/chats", controller.GetAll)
	r.POST("/chats/:id/messages", controller.PostMessage)
	r.GET("/chats/:id/generate", controller.GetStream)
}
