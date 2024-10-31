import { ollama } from "@/types/ollama";
import { Model } from "../Model";
import { OllamaResolver, StreamResponseResolver } from "../Resolver";

export type RequestOptions = {
  abortController?: AbortController;
};

/**
 * Represents an interface of the request message
 * that will send to the server backend.
 */
export type RequestMessage = {
  /**
   * Represents specific model that will be used.
   *
   * - For `Ollama`, it could be llama3.2, llava...
   * - For `OpenAI`, it could be gpt-3.5-turbo, gpt-4...
   */
  model: string;
  /**
   * Represents a message that will be prompted
   * to the backend.
   */
  prompt?: string;
};

/**
 * Represents a API provider that provides the ability to send and receive messages.
 *
 * @author PlayerNguyen
 * @version 1.0
 */
export interface Provider<MessageRequestType = any, MessageResponseType = any> {
  resolver: StreamResponseResolver<MessageResponseType>;

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

/**
 * Represents an `Ollama` request body message backend.
 *
 * Reference:
 * - {@link https://github.com/ollama/ollama/blob/main/docs/api.md#parameters}
 */
export type OllamaRequestMessage = RequestMessage & {
  suffix?: string;
  images?: string[];
};

export type MessageResponse = {};

/**
 * Interface describing the data returned from the ResponseStream.
 *
 * This object contains various metrics and information related to the response generation process,
 * including total duration, model loading time, prompt evaluation statistics, and conversation context.
 */
export type OllamaResponseMessage = MessageResponse & ollama.Response;

export class OllamaProvider
  implements Provider<OllamaRequestMessage, OllamaResponseMessage>
{
  private base_host_url: string;
  public resolver: StreamResponseResolver<ollama.Response> =
    new OllamaResolver();

  /**
   * Constructs a new Ollama type provider.
   *
   * @param base_host_url A base url to send and receive messages.
   */
  constructor(base_host_url?: string) {
    this.base_host_url = base_host_url || "http://localhost:11434/api";
  }

  async createStreamChat(
    message: OllamaRequestMessage,
    options?: RequestOptions
  ): Promise<ReadableStream<Uint8Array> | null> {
    console.log(
      `[OllamaProvider] Creates a stream chat with prompt ${message.prompt}`
    );

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

    console.log(
      `[OllamaProvider] Respond ${response.status} with status text: ${response.statusText}`
    );

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
