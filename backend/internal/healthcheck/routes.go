package healthcheck

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine, c Controller) {
	r.GET("/health/liveness", c.Get)
}
