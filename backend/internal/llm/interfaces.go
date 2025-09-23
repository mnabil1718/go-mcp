package llm

import "context"

type LLMClient interface {
	Stream(ctx context.Context, payload map[string]any, onChunkCallback OnChunkCallback) error
}
