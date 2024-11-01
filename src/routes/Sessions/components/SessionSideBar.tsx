import Session from "@/lib/Session";
import { useSessionStore } from "@/stores/SessionStore";
import { RandomUtils } from "@/utils/RandomUtils";
import { ActionIcon, Flex, Text, UnstyledButton } from "@mantine/core";
import clsx from "clsx";
import dayjs from "dayjs";
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
      className={clsx(
        // Primary background
        `bg-neutral-100 p-4 shadow-sm z-50 select-none`,
        // Border improvement
        `border-0 border-b border-neutral-300 border-solid`,
        `h-[64px]`
      )}
      justify={"center"}
      align={"center"}
    >
      <Flex className="flex-1">
        <Text size="xl" fw={"bold"}>
          Sessions
        </Text>
      </Flex>
      <ActionIcon
        className={clsx(`btn-create-session`)}
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
      className={clsx(
        `bg-neutral-200 min-w-[25vw] h-[100vh] w-1/3`,
        `border-0 border-r border-solid border-neutral-300`,
        `shadow-md`
      )}
    >
      {children}
    </Flex>
  );
};

export type SessionSideBarItemProps = {
  session: Session;
  isActive: boolean;
};

SessionSideBar.Item = function ({
  session,
  isActive,
}: SessionSideBarItemProps) {
  const { setActiveSessionId } = useSessionStore();

  function handleSwitchActiveSession() {
    setActiveSessionId(session.uniqueId);
  }

  return (
    <UnstyledButton
      className={clsx(
        `session-item-wrapper group outline-none focus-visible:outline-none`
      )}
      onClick={handleSwitchActiveSession}
    >
      <Flex
        direction={`row`}
        className={clsx(
          `session-item group transition-all px-4 py-2`,
          `border-0 border-b border-solid border-neutral-300`,
          `bg-neutral-100 hover:bg-neutral-200 select-none`,
          `cursor-pointer`,
          // Add active logic
          { "bg-neutral-300": isActive },
          `outline-none group-focus:bg-neutral-200`
        )}
      >
        <Flex direction={`column`} gap={4} className="flex-1">
          <Text
            fw={"bold"}
            size="sm"
            className={clsx(`leading-tight text-neutral-800`, `line-clamp-2`)}
          >
            {session.title || "Untitled chat"}
          </Text>
          <Text size="xs" className="text-neutral-400 font-bold">
            {session.createdAt !== undefined
              ? dayjs(session.createdAt).fromNow(true)
              : "Undefined"}{" "}
            • {session.model || ""}
          </Text>
        </Flex>
        <Flex direction={`column`} align={`center`} justify={`center`}>
          <ActionIcon
            radius={`xl`}
            variant="subtle"
            className={clsx(
              `transition-all group/button text-transparent`,
              `hover:text-neutral-950 group-hover:text-neutral-400 hover:bg-red-300`,
              `focus:text-neutral-950 group-focus:text-neutral-400 focus:bg-red-300`,
              `outline-none focus-visible:outline-none`
            )}
          >
            <TbTrash className="transition-all ease-in-out group-hover/button:text-red-600 group-focus/button:text-red-600" />
          </ActionIcon>
        </Flex>
      </Flex>
    </UnstyledButton>
  );
};

SessionSideBar.Content = function () {
  const { sessions, activeSessionId } = useSessionStore();

  return (
    <Flex
      direction={"column"}
      className="max-h-[100vh] h-full overflow-y-auto overflow-x-hidden"
    >
      {Array.from(sessions.values())
        .reverse()
        .map((session) => {
          return (
            <SessionSideBar.Item
              session={session}
              key={session.uniqueId}
              isActive={activeSessionId === session.uniqueId}
            />
          );
        })}
    </Flex>
  );
};
