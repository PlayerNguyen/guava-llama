import MessageContent from "@/components/MessageContent";
import ModelSelect from "@/components/ModelSelect";
import { MessageResponse, OllamaResponseMessage } from "@/lib/Provider";
import { useAppStore } from "@/stores/AppStore";
import useChatStore from "@/stores/ChatStore";
import { useSessionStore } from "@/stores/SessionStore";
import { RandomUtils } from "@/utils/RandomUtils";
import { Button, Flex, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import clsx from "clsx";
import { marked } from "marked";

export default function SessionMain() {
  return <></>;
}

SessionMain.Header = () => {
  const { activeSessionId, getSession } = useSessionStore();
  if (activeSessionId === null) {
    return <>Error to render since active session id is null</>;
  }

  const currentActiveSession = getSession(activeSessionId);

  return (
    <Flex
      direction={"row"}
      align={`center`}
      gap={6}
      className={clsx(
        `w-full bg-neutral-100 h-[64px] px-6 shadow-sm`,
        `border-0 border-b border-solid border-neutral-300`,
        `z-30`
      )}
    >
      <Text size="xs" fw={"bold"} className="text-neutral-300">
        <span className="text-underline decoration-neutral-800">
          #{activeSessionId}
        </span>
      </Text>
      <Text>·</Text>
      <Text
        size="xs"
        className={clsx(`line-clamp-2 font-bold text-neutral-700`)}
      >
        {currentActiveSession?.title || "Untitled chat"}
      </Text>
    </Flex>
  );
};

SessionMain.MessageContent = () => {
  const { getActiveSession } = useSessionStore();
  const activeSession = getActiveSession();

  if (activeSession === null) {
    // TODO: fix this
    return <>Invalid session id</>;
  }

  return (
    <Flex
      className="bg-neutral-100 h-[calc(80vh-64px)] overflow-y-auto px-4 py-2"
      gap={6}
      direction={"column"}
    >
      {activeSession.messages.map((message) => {
        if (message.type === "user") {
          return (
            <MessageContent.User
              content={message.content}
              key={message.id}
              label="User"
            />
          );
        }
        return (
          <MessageContent.System
            content={marked.parse(message.content, { async: false })}
            key={message.id}
            label="Bot"
          />
        );
      })}
    </Flex>
  );
};

SessionMain.Interaction = () => {
  const { updateSession, getActiveSession, activeSessionId } =
    useSessionStore();

  const { sendMessage } = useChatStore();
  const { provider } = useAppStore();

  const currentActiveSession = getActiveSession();

  if (currentActiveSession === null) {
    // TODO: fix this
    return <>Invalid session id</>;
  }

  const form = useForm({
    initialValues: {
      model: currentActiveSession.model || "",
      question: "",
    },

    validate: {
      model: (value) => (value ? null : "Model is required"),
      question: (value) => (value ? null : "Question is required"),
    },
  });

  const handleSubmit = (values: { model: string; question: string }) => {
    // Perform submission logic here
    console.log("Submitted data:", values);
    console.log(`Current active session id: `, activeSessionId);

    const curActiveSession = structuredClone(getActiveSession());
    // Null check for cur
    if (!curActiveSession) {
      throw new Error(`Invalid current active session.`);
    }

    // If is not used, set title and set used to true
    if (!curActiveSession.isUsed) {
      curActiveSession.isUsed = true;
      // TODO: update a session title here?
      curActiveSession.title = values.question;
    }

    curActiveSession.model = values.model;
    curActiveSession?.messages.push({
      type: "user",
      content: values.question,
      at: new Date(),
      id: RandomUtils.generateRandomReadableId(),
    });

    updateSession(activeSessionId!, curActiveSession!);

    // Create response message
    const clonedCurActiveSession = structuredClone(curActiveSession);
    const curMessageIndex =
      clonedCurActiveSession.messages.push({
        at: new Date(),
        id: RandomUtils.generateRandomReadableId(),
        content: "",
        type: "bot",
      }) - 1;

    // Send message
    sendMessage(
      provider,
      {
        model: values.model,
        prompt: values.question,
      },
      (chunk: MessageResponse) => {
        const message = chunk as any as OllamaResponseMessage;
        // console.log(message);

        const content = message.response;
        // console.log(content);
        clonedCurActiveSession.messages[curMessageIndex].content += content;
        updateSession(activeSessionId!, clonedCurActiveSession);
      }
    );

    // Clear the chat input field after submission
    // form.reset();
    form.setValues({ question: "" });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Flex
        direction={"column"}
        gap={5}
        className="bg-neutral-200 h-[20vh] z-20 shadow-md border-0 border-t border-solid border-neutral-400 px-4 py-2 overflow-hidden"
      >
        <ModelSelect
          size="xs"
          w={"320px"}
          placeholder="Select a model"
          {...form.getInputProps("model")}
        />

        <Flex gap={5}>
          <Flex className="flex-1">
            <Textarea
              className="w-full"
              size="xs"
              placeholder="What you want to ask?"
              {...form.getInputProps("question")}
            />
          </Flex>
          <Button type="submit">Run</Button>
        </Flex>
      </Flex>
    </form>
  );
};

SessionMain.Layout = () => {
  return (
    <Flex direction="column" className="w-full">
      <SessionMain.Header />
      <SessionMain.MessageContent />
      <SessionMain.Interaction />
    </Flex>
  );
};

SessionMain.Empty = () => {
  return (
    <Flex align={"center"} justify={"center"} className="w-full">
      <Text size={"xxl"} className="text-neutral-500">
        Please select a session or create a new session to continue.
      </Text>
    </Flex>
  );
};
