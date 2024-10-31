import { ollama } from "./../types/ollama";

/**
 * A resolver function that takes in an input of type `I` and returns a promise resolving to a value of type `T`.
 *
 * @template I - The type of the input.
 * @template T - The type of the output.
 * @interface Resolver
 */
export interface Resolver<I, T> {
  /**
   * Resolves the input to a value of type `T` and returns it as a promise.
   *
   * @param {I} input The input to be resolved.
   * @returns {Promise<T>} A promise resolving to a value of type `T`.
   */
  resolve(input: I): Promise<T>;
}

/**
 * A resolver function that takes in an input of type `Uint8Array` and returns a promise resolving to a value of type `T`.
 *
 * @template T - The type of the output.
 * @extends {Resolver<Uint8Array, T>} Resolver
 */
export interface StreamResponseResolver<T> extends Resolver<Uint8Array, T> {
  /**
   * Resolves the input stream (an array of bytes) to a value of type `T` and returns it as a promise.
   *
   * @param {Uint8Array} input The input stream to be resolved.
   * @returns {Promise<T>} A promise resolving to a value of type `T`.
   */
  resolve(input: Uint8Array): Promise<T>;
}

export class OllamaResolver implements StreamResponseResolver<ollama.Response> {
  /**
   * Represents decoder to decode Uint8Array to
   * a raw text.
   *  */
  private decoder = new TextDecoder();

  async resolve(input: Uint8Array): Promise<ollama.Response> {
    try {
      let rawOutput = this.decoder.decode(input);
      
      return JSON.parse(rawOutput) as ollama.Response;
    } catch (err: any) {
      throw new Error(`Unable to resolve the body due to: ` + err.message);
    }
  }
}
