package config

import (
	"fmt"
	"log"
	"os"

	"github.com/spf13/viper"
)

type Config struct {
	Port           int
	LLMApiEndpoint string
}

var (
	version string = "1.0.0"
)

func LoadConfig() *Config {
	var config Config

	viper.SetConfigFile(".env")
	viper.AutomaticEnv()
	if err := viper.ReadInConfig(); err != nil {
		if os.Getenv("GO_ENV") != "test" {
			log.Fatalf("%v", err)
		}
	}

	if viper.GetBool("DISPLAY_VERSION") {
		fmt.Printf("Version:\t%s\n", version)
		os.Exit(0)
	}

	config.Port = viper.GetInt("PORT")
	config.LLMApiEndpoint = viper.GetString("LLM_API_ENDPOINT")

	return &config
}
