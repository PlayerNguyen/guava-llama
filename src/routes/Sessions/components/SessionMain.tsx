import ModelSelect from "@/components/ModelSelect";
import { useSessionStore } from "@/stores/SessionStore";
import { RandomUtils } from "@/utils/RandomUtils";
import { Button, Flex, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

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
      className="w-full bg-neutral-100 h-[64px] px-6 shadow-sm"
    >
      <Text size="sm" fw={"bold"} className="text-neutral-500">
        <span className="text-underline decoration-neutral-800">
          #{activeSessionId}
        </span>
      </Text>
      <Text>·</Text>
      <Text size="sm">{currentActiveSession?.title || "Untitled chat"}</Text>
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
      className="bg-neutral-400 h-[calc(80vh-64px)] overflow-y-auto"
      direction={"column"}
    >
      {activeSession.messages.map((message) => (
        <Text>{message.content}</Text>
      ))}
    </Flex>
  );
};

SessionMain.Interaction = () => {
  const { updateSession, getActiveSession, activeSessionId } =
    useSessionStore();

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
