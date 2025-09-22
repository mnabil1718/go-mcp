package commons

import (
	"context"
	"net/http"
)

func SSE(ctx context.Context, flusher http.Flusher, w http.ResponseWriter, queue chan []byte) {

	for {
		select {
		case <-ctx.Done():
			// client closed connection (browser tab closed, network down, etc)
			return

		case chunk, ok := <-queue:
			if !ok {
				// upstream closed channel, nothing more to stream
				return
			}

			if _, err := w.Write(chunk); err != nil {
				// client disconnected — stop streaming
				return
			}

			flusher.Flush()

		}
	}
}
