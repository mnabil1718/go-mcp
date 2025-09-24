package llm

import "context"

type LLMClient interface {
	GenerateTitle(ctx context.Context, payload map[string]any) (*string, error)
	Respond(ctx context.Context, payload map[string]any, onChunkCallback OnChunkCallback) error
}
