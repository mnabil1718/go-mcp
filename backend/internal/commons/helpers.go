package commons

import (
	"errors"
	"net/http"
	"strings"
	"unicode"

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

func SanitizeTitle(t string) string {
	s := strings.TrimSpace(t)

	// Replace any run of whitespace (spaces, tabs, newlines) with a single space
	fields := strings.Fields(s)
	s = strings.Join(fields, " ")

	s = strings.Map(func(r rune) rune {
		if unicode.IsPunct(r) {
			return -1
		}
		return r
	}, s)

	// capitalize first letter
	runes := []rune(s)
	runes[0] = unicode.ToUpper(runes[0])
	s = string(runes)

	return s
}

// convert string s to *string pointer
func ToSPtr(s string) *string {
	return &s
}
