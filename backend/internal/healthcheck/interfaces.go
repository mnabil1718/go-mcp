package healthcheck

import "github.com/gin-gonic/gin"

type Controller interface {
	Get(c *gin.Context)
}
