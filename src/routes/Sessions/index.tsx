import Session from "@/lib/Session";
import { useSessionStore } from "@/stores/SessionStore";
import { Flex } from "@mantine/core";
import SessionMain from "./components/SessionMain";
import SessionSideBar from "./components/SessionSideBar";

export type SessionPropertyInternalState = {
  currentSession?: Session;
};

export default function Sessions() {
  const { activeSessionId } = useSessionStore();

  return (
    <Flex direction={"row"} className="session-layout w-full">
      {/* Chat sessions side bar */}
      <SessionSideBar.Container>
        <>
          <SessionSideBar.Header key="sidebar-header" />
          <SessionSideBar.Content key="sidebar-content" />
        </>
      </SessionSideBar.Container>

      {/* Session main  */}
      {activeSessionId === null ? (
        <SessionMain.Empty />
      ) : (
        <SessionMain.Layout />
      )}
    </Flex>
  );
}
