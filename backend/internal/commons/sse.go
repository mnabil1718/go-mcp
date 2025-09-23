package commons

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleSseStreaming(ctx context.Context, w http.ResponseWriter, queue chan map[string]any, errChan chan error) error {

	// Setup SSE headers
	w.Header().Set("Content-Type", "text/event-stream; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache, no-transform")
	w.Header().Set("Connection", "keep-alive")

	flusher, ok := w.(http.Flusher)
	if !ok {
		return fmt.Errorf("streaming not supported")
	}

	for {
		select {
		case <-ctx.Done():
			// client closed connection
			return nil

		case err, ok := <-errChan:
			if ok && err != nil {
				// stream error back to client
				fmt.Fprintf(w, "event: error\ndata: %q\n\n", err.Error())
				flusher.Flush()
				return err
			}

		case chunk, ok := <-queue:
			if !ok {
				// llm client finish streaming
				return nil
			}

			if msgObj, ok := chunk["message"].(map[string]any); ok {
				if content, ok := msgObj["content"].(string); ok {
					// send SSE
					b, _ := json.Marshal(map[string]any{
						"role":    "assistant",
						"content": content,
					})
					fmt.Fprintf(w, "event: message\ndata: %s\n\n", b)
					flusher.Flush()
				}
			}

			if done, ok := chunk["done"].(bool); ok && done {
				fmt.Fprintf(w, "event: done\ndata: {\"done\":true}\n\n")
				flusher.Flush()
			}
		}
	}
}
