package llm

import "context"

type LLMClient interface {
	Respond(ctx context.Context, payload map[string]any, onChunkCallback OnChunkCallback) error
}
