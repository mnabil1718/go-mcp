package commons

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

func TranslateDomainError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, ErrRecordNotFound):
		ErrorResponse(c, http.StatusNotFound, err.Error())
	default:
		ErrorResponse(c, http.StatusInternalServerError, err.Error())
	}
}

func ErrorResponse(c *gin.Context, httpStatusCode int, msg string) {
	c.JSON(httpStatusCode, gin.H{
		"status":  "fail",
		"message": msg,
	})
}

func SuccessResponse(c *gin.Context, httpStatusCode int, msg *string, data any) {
	res := gin.H{
		"status": "success",
	}

	if data != nil {
		res["data"] = data
	}

	if msg != nil {
		res["message"] = msg
	}

	c.JSON(httpStatusCode, res)
}
