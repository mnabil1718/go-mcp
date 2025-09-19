package main

import (
	"log"
)

func main() {

	app := NewApp()
	if err := app.Start(); err != nil {
		log.Fatalf("Application stopped with error: %v", err)
	}

}
