package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/mnabil1718/mcp-go/internal/commons"
)

type OllamaClient struct {
	APIEndpoint string
}

func NewOllamaClient(apiEndpoint string) LLMClient {
	return &OllamaClient{
		APIEndpoint: apiEndpoint,
	}
}

func (c *OllamaClient) Respond(ctx context.Context, payload map[string]any, onChunkCallback OnChunkCallback) error {

	data, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal request payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", fmt.Sprintf("%s/%s", c.APIEndpoint, "chat"), bytes.NewBuffer(data))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{
		Transport: &http.Transport{
			ResponseHeaderTimeout: 10 * time.Second,
			IdleConnTimeout:       90 * time.Second,
		},
	}

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to reach llm backend: %w", err)
	}
	defer resp.Body.Close()

	dec := json.NewDecoder(resp.Body)

	for {
		var chunk Chunk
		if err := dec.Decode(&chunk); err != nil {
			if errors.Is(err, io.EOF) {
				return nil
			}

			return err
		}

		if err = onChunkCallback(chunk); err != nil {
			return err
		}
	}

}

func (c *OllamaClient) GenerateTitle(ctx context.Context, payload map[string]any) (*string, error) {

	data, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", fmt.Sprintf("%s/%s", c.APIEndpoint, "generate"), bytes.NewBuffer(data))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{
		Transport: &http.Transport{
			ResponseHeaderTimeout: 20 * time.Second,
			IdleConnTimeout:       90 * time.Second,
		},
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to reach llm backend: %w", err)
	}
	defer resp.Body.Close()

	var res NonStreamGenerateResponse
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return nil, err
	}

	t := commons.SanitizeTitle(res.Response)
	return &t, nil
}
