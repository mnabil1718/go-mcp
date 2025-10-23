package commons

import (
	"reflect"

	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/locales/en"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	en_translations "github.com/go-playground/validator/v10/translations/en"
)

const (
	enLocaleString = "en"
)

var (
	Validate   *validator.Validate
	Translator ut.Translator
)

func UseGlobalValidator() error {
	enLocale := en.New()
	u := ut.New(enLocale, enLocale)
	Translator, _ = u.GetTranslator(enLocaleString)

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {

		Validate = v
		if err := en_translations.RegisterDefaultTranslations(v, Translator); err != nil {
			return err
		}

		// return `json`` field name instead of struct field name
		v.RegisterTagNameFunc(func(field reflect.StructField) string {
			name := field.Tag.Get("json")
			if name == "-" {
				return ""
			}
			return name
		})
	}

	return nil
}
