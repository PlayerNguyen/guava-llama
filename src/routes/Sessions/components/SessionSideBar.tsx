import Session from "@/lib/Session";
import { useSessionStore } from "@/stores/SessionStore";
import { RandomUtils } from "@/utils/RandomUtils";
import { ActionIcon, Flex, Text } from "@mantine/core";
import { TbEdit, TbTrash } from "react-icons/tb";

export default function SessionSideBar() {
  return <></>;
}

SessionSideBar.Header = function () {
  const {
    addSession,
    isTopSessionEmpty,
    lastSessionId,
    setLastSessionId,
    setActiveSessionId,
  } = useSessionStore();

  function handleCreateSession() {
    if (isTopSessionEmpty() && lastSessionId !== null) {
      setLastSessionId(lastSessionId);
      console.warn(
        `The top session is empty. Stop creating a new session for spamming. However, please disable any create button to prevent spamming.`
      );
      return;
    }
    const generatedId = RandomUtils.generateRandomReadableId();
    console.log(`Creating a new session ${generatedId}`);

    const generatedSession = new Session(generatedId);
    addSession(generatedSession);
    setActiveSessionId(generatedSession.uniqueId);
    setLastSessionId(generatedSession.uniqueId);
  }

  return (
    <Flex
      className="bg-neutral-100 p-4 shadow-sm border-0 border-b border-neutral-300 border-solid z-50 select-none"
      justify={"center"}
      align={"center"}
    >
      <Flex className="flex-1">
        <Text size="xl" fw={"bold"}>
          Sessions
        </Text>
      </Flex>
      <ActionIcon
        variant="subtle"
        size={"md"}
        onClick={handleCreateSession}
        disabled={isTopSessionEmpty() && lastSessionId !== null}
      >
        <TbEdit size={20} />
      </ActionIcon>
    </Flex>
  );
};

export type SessionListContainerProps = {
  children: React.ReactElement;
};

SessionSideBar.Container = function ({ children }: SessionListContainerProps) {
  return (
    <Flex
      direction={"column"}
      className="bg-neutral-200 min-w-[25vw] h-[100vh] w-1/3"
    >
      {children}
    </Flex>
  );
};

export type SessionSideBarItemProps = {
  session: Session;
};

SessionSideBar.Item = function ({ session }: SessionSideBarItemProps) {
  const { setActiveSessionId } = useSessionStore();

  function handleSwitchActiveSession() {
    setActiveSessionId(session.uniqueId);
  }

  return (
    <Flex
      direction={`row`}
      className="session-item group transition-all px-4 py-2 border-0 border-b border-solid border-neutral-300 bg-neutral-100 hover:bg-neutral-200 select-none cursor-pointer"
      onClick={handleSwitchActiveSession}
    >
      <Flex direction={`column`} gap={2} className="flex-1">
        <Text fw={"bold"} size="sm" className="leading-tight text-neutral-800">
          {session.title || "Untitled chat"}
        </Text>
        <Text size="xs" className="text-neutral-700 font-medium">
          12:34:56
        </Text>
      </Flex>
      <Flex direction={`column`} align={`center`} justify={`center`}>
        <ActionIcon
          radius={`xl`}
          variant="subtle"
          className="transition-all group/button hover:text-neutral-950 group-hover:text-neutral-400 text-transparent hover:bg-red-300"
        >
          <TbTrash className="transition-all ease-in-out group-hover/button:text-red-600" />
        </ActionIcon>
      </Flex>
    </Flex>
  );
};

SessionSideBar.Content = function () {
  const { sessions } = useSessionStore();

  return (
    <Flex
      direction={"column"}
      className="max-h-[100vh] h-full overflow-y-auto overflow-x-hidden"
    >
      {Array.from(sessions.values())
        .reverse()
        .map((session) => {
          return (
            <SessionSideBar.Item session={session} key={session.uniqueId} />
          );
        })}
    </Flex>
  );
};
