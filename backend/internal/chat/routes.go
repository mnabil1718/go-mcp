package chat

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine, controller Controller) {
	r.POST("/chats", controller.Post)
	r.GET("/chats", controller.GetAll)
	r.GET("/chats/:id", controller.GetById)
	r.DELETE("/chats/:id", controller.Delete)
	r.PATCH("/chats/:id", controller.PatchTitle)
	r.GET("/chats/:id/generate", controller.GetStream)
	r.POST("/chats/:id/messages", controller.PostMessage)
	r.POST("/chats/:id/generate-title", controller.PostTitle)
}
