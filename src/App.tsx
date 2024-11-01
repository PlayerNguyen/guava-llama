import { RouterProvider } from "react-router-dom";
import router from "./router";

import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { useEffect } from "react";
import { useAppStore } from "./stores/AppStore";
import { useModelStore } from "./stores/ModelStore";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * The App component serves as the top-level entry point for the application.
 *
 * It wraps the provider components to provide a consistent design system and routing configuration.
 */
export default function App() {
  const { provider } = useAppStore();
  const { loadModelFromProvider } = useModelStore();

  useEffect(() => {
    loadModelFromProvider(provider);
  }, []);

  return (
    <MantineProvider>
      <RouterProvider router={router.AppRouter} />
    </MantineProvider>
  );
}
