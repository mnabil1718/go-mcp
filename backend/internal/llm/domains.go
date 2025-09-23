package llm

type Chunk map[string]any

type OnChunkCallback func(Chunk) error
