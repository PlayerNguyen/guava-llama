import { expect, test } from "vitest";
import { OllamaProvider } from "./../../../src/lib/Provider/index";

test(
  "should create an ollama provider",
  async () => {
    const provider = new OllamaProvider();
    const response = await provider.createStreamChat({
      model: "llama3.2",
      prompt: "Response a single OK word",
    });
    expect(response).not.toBeNull();
    // Check that the response is an instance of ReadableStream
    expect(response).toBeInstanceOf(ReadableStream);
    expect(response?.getReader()).not.toBeUndefined();
  },
  {
    timeout: 20000,
  }
);

test(
  `should fetch models response an array`,
  async () => {
    const models = await new OllamaProvider().fetchModels();

    expect(models).toBeInstanceOf(Array);
    expect(models).toBeInstanceOf(Array);
    expect(models).toHaveProperty("length");
  },
  {
    timeout: 10000,
  }
);
