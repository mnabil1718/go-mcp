package healthcheck

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type HealthcheckController struct {
}

func NewHealthcheckController() Controller {
	return &HealthcheckController{}
}

func (cr *HealthcheckController) Get(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "alive"})
}
