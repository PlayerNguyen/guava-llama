import { Model } from "../Model";

export type RequestOptions = {
  abortController?: AbortController;
};
/**
 * Represents a API provider that provides the ability to send and receive messages.
 *
 * @author PlayerNguyen
 * @version 1.0
 */
export interface Provider<MessageRequestType = any, MessageResponseType = any> {
  createStreamChat(
    message: MessageRequestType,
    options?: RequestOptions
  ): Promise<ReadableStream<Uint8Array> | null>;

  /**
   * Fetches the model from the provider,
   *
   */
  fetchModels(): Promise<Model[]>;
}

type OllamaRequestMessage = {
  model: string;
  prompt?: string;
  suffix?: string;
  images?: string[];
};

/**
 * Interface describing the data returned from the ResponseStream.
 *
 * This object contains various metrics and information related to the response generation process,
 * including total duration, model loading time, prompt evaluation statistics, and conversation context.
 */
type OllamaResponseMessage = Partial<{
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
  context: string;
  response: any;
}>;

export class OllamaProvider
  implements Provider<OllamaRequestMessage, OllamaResponseMessage>
{
  private base_host_url: string;
  constructor(base_host_url?: string) {
    this.base_host_url = base_host_url || "http://localhost:11434/api";
  }

  async createStreamChat(
    message: OllamaRequestMessage,
    options?: RequestOptions
  ): Promise<ReadableStream<Uint8Array> | null> {
    const response = await fetch(this.base_host_url + "/generate", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: message.model,
        prompt: message.prompt || "",
        suffix: message.suffix || "",
        images: message.images || [],
      }),
      signal: options?.abortController?.signal || null,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.body;
  }

  async fetchModels(options?: RequestOptions) {
    const response = await fetch(this.base_host_url + "/tags", {
      method: "GET",

      signal: options?.abortController?.signal || null,
    });
    const jsonResponse = await response.json();

    const models = jsonResponse.models.map((e: any) => {
      return {
        name: e.name,
      };
    });
    return models;
  }
}
