package commons

import (
	"errors"
	"net/http"
	"strings"
	"unicode"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func TranslateDomainError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, ErrRecordNotFound):
		ErrorResponse(c, http.StatusNotFound, ToSPtr(err.Error()), nil)
	default:
		ErrorResponse(c, http.StatusInternalServerError, ToSPtr(err.Error()), nil)
	}
}

func TranslateValidationError(c *gin.Context, err error) {
	ve, ok := err.(validator.ValidationErrors)
	if !ok {
		ErrorResponse(c, http.StatusInternalServerError, ToSPtr(err.Error()), nil)
	} else {
		fieldErrors := make(map[string]string, len(ve))
		for _, f := range ve {
			fieldErrors[f.Field()] = f.Translate(Translator)
		}

		ErrorResponse(c, http.StatusBadRequest, nil, fieldErrors)
	}
}

// return gin context with map[string]any format.
// accepts httpStatusCode, optional message,
// and optional errors for field errors
func ErrorResponse(c *gin.Context, httpStatusCode int, msg *string, fieldErrors map[string]string) {
	res := gin.H{
		"status": "fail",
	}

	if msg != nil {
		res["message"] = msg
	}

	if fieldErrors != nil {
		res["errors"] = fieldErrors
	}

	c.JSON(httpStatusCode, res)
}

// return gin context with map[string]ant format.
// accepts status code, optional message, and optional data.
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
