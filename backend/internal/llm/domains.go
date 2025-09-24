package llm

import "time"

type Chunk map[string]any

type NonStreamGenerateResponse struct {
	Model              string    `json:"model"`
	CreatedAt          time.Time `json:"created_at"`
	Response           string    `json:"response"`
	Done               bool      `json:"done"`
	Context            []int     `json:"context"`
	TotalDuration      int64     `json:"total_duration"`
	LoadDuration       int64     `json:"load_duration"`
	PromptEvalCount    int       `json:"prompt_eval_count"`
	PromptEvalDuration int64     `json:"prompt_eval_duration"`
	EvalCount          int       `json:"eval_count"`
	EvalDuration       int64     `json:"eval_duration"`
}

type OnChunkCallback func(Chunk) error

const (
	Mistral    string = "mistral:latest"
	DeepSeekR1 string = "deepseek-r1:latest"
	Llama3     string = "llama3.2:latest"
)
