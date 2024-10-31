import { MessageResponse, Provider, RequestMessage } from "@/lib/Provider";
import { create } from "zustand";

export type ChatStoreType = {
  /**
   * Represents the chat provider is
   * streaming messages.
   */
  isGenerating: boolean;

  /**
   * Assigns isGenerating value reducer.
   *
   * @param value a value to set to the isGenerating
   */
  setGenerating: (value: boolean) => void;

  /**
   * Sends chat message.
   */
  sendMessage: (
    provider: Provider,
    messageRequest: RequestMessage,
    onChunk?: (chunk: MessageResponse) => void
  ) => void;
};

/**
 * Represents a store for managing chat-related state.
 */
const useChatStore = create<ChatStoreType>((set) => ({
  isGenerating: false,

  setGenerating: (value: boolean) => {
    set((state) => ({ ...state, isGenerating: value }));
  },

  sendMessage: async (
    provider: Provider,
    messageRequest: RequestMessage,
    onChunk?: (chunk: MessageResponse) => void
  ) => {
    // Set is generating (start streaming)
    set((state) => ({ ...state, isGenerating: true }));

    // Open streaming to the server
    const responseReader = await provider.createStreamChat(messageRequest);

    if (!responseReader) {
      throw new Error("Failed to open stream for chatting.");
    }

    const reader = responseReader.getReader();

    // Read chunks and do event
    reader
      .read()
      // @ts-ignore
      .then(async function tick({ value, done }) {
        // No more content to stream
        if (done) {
          return;
        }
        // Assert not undefined
        if (value === undefined)
          throw new Error(
            "Unable to parse value to resolver, the value is undefined."
          );

        onChunk && onChunk(await provider.resolver.resolve(value));
        return reader.read().then(tick);
      });
  },
}));

export default useChatStore;
