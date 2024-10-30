import Session from "@/lib/Session";
import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";

export type UseSessionStoreType = {
  sessions: Map<string, Session>;
  lastSessionId: string | null;
  activeSessionId: string | null;

  addSession: (session: Session) => void;
  deleteSession(id: string): void;
  updateSession: (id: string, session: Session) => void;
  getSession: (id: string) => Session | undefined;

  isTopSessionEmpty: () => boolean;
  setLastSessionId: (session: string | null) => void;

  setActiveSessionId: (sessionId: string | null) => void;
  getActiveSession: () => Session | null;
};

const useSessionStore = create<UseSessionStoreType>()(
  persist(
    (set, get) => ({
      sessions: new Map(),
      lastSessionId: null,
      activeSessionId: null,

      addSession: (session: Session) => {
        set((state) => {
          const currentSessions = state.sessions;
          currentSessions.set(session.uniqueId, session);

          return {
            ...state,
            sessions: currentSessions,
          };
        });
      },

      deleteSession: (id) => {
        set((state) => {
          const currentSessions = structuredClone(state.sessions);
          if (currentSessions.has(id)) {
            currentSessions.delete(id);
          }

          return {
            ...state,
            sessions: currentSessions,
          };
        });
      },

      updateSession: (id, session) => {
        set((state) => ({
          ...state,
          sessions: new Map([
            ...state.sessions.entries(),
            [session.uniqueId, { ...state.sessions.get(id), ...session }],
          ]),
          lastSession: id === state.lastSessionId ? session : null,
        }));
      },

      getSession: (id: string) => {
        return get().sessions.get(id);
      },

      isTopSessionEmpty: () => {
        const lastSessionId = get().lastSessionId;
        if (!lastSessionId) {
          return true;
        }

        // Get session id from session list, if not returns true
        const lastSessionObject = get().sessions.get(lastSessionId);
        if (lastSessionObject === undefined) {
          return true;
        }

        return !lastSessionObject.isUsed;
      },

      setLastSessionId: (session?: string | null) => {
        set((state) => ({ ...state, lastSession: session }));
      },

      setActiveSessionId(sessionId) {
        set((state) => ({ ...state, activeSessionId: sessionId }));
      },

      getActiveSession: () => {
        const { activeSessionId, sessions } = get();
        return activeSessionId !== null
          ? sessions.get(activeSessionId) ?? null
          : null;
      },
    }),
    {
      name: "sessions",
      /**
       * This configuration follows zustard/middleware
       * sites:
       * https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#how-do-i-use-it-with-map-and-set
       */
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const existingValue = JSON.parse(str);
          return {
            ...existingValue,
            state: {
              ...existingValue.state,
              sessions: new Map(existingValue.state.sessions),
            },
          };
        },
        setItem: (name, newValue: StorageValue<UseSessionStoreType>) => {
          // functions cannot be JSON encoded
          const str = JSON.stringify({
            ...newValue,
            state: {
              ...newValue.state,
              sessions: Array.from(newValue.state.sessions.entries()),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

export { useSessionStore };
