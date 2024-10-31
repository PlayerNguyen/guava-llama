export namespace ollama {
  export interface Response {
    /**
     * The model used to generate this response.
     * Example: "llama3.2"
     */
    model: string;

    /**
     * The timestamp for when the response was created.
     * Example format: "2023-08-04T19:22:45.499127Z" (UTC in ISO 8601)
     */
    created_at: string;

    /**
     * The generated response text.
     * If the response was streamed, this field remains empty.
     * Otherwise, it will contain the full response text.
     */
    response: string;

    /**
     * Indicates whether the response generation is complete.
     * It is set to true once the response has been fully generated.
     */
    done: boolean;

    /**
     * An array of context identifiers used in this response.
     * These can be provided in the next request to maintain
     * continuity and memory in a conversation.
     */
    context?: number[];

    /**
     * The total time spent in generating the response, in nanoseconds.
     */
    total_duration?: number;

    /**
     * The time spent loading the model, in nanoseconds.
     * This is part of the total generation time.
     */
    load_duration?: number;

    /**
     * The number of tokens evaluated from the prompt.
     * Represents how many tokens were processed from the prompt
     * before generating the response.
     */
    prompt_eval_count?: number;

    /**
     * The time spent in evaluating the prompt, in nanoseconds.
     * Indicates the processing time taken to analyze the prompt.
     */
    prompt_eval_duration?: number;

    /**
     * The number of tokens generated in the response.
     * Reflects the token count in the final response text.
     */
    eval_count?: number;

    /**
     * The time spent generating the response text, in nanoseconds.
     * Part of the total duration, specifically for text generation.
     */
    eval_duration?: number;
  }
}
