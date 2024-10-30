import { lazy, Suspense } from "react";
import { createHashRouter } from "react-router-dom";
import AppLayout from "./components/AppLayout";

const Sessions = lazy(() => import("./routes/Sessions"));

const AppRouteMap = {
  Sessions: "/",
};

/**
 * Defines the AppRouter, which is used to configure routing for the application.
 *
 * The AppRouter includes a single route that renders the AppLayout component with the
 * related path for each router.
 *
 * Please use a lazy in order to avoid large bundling size when its built by vite.
 */
const AppRouter = createHashRouter([
  {
    // index: true,
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: AppRouteMap.Sessions,
        element: (
          <Suspense>
            <Sessions />
          </Suspense>
        ),
      },
    ],
  },
]);

export { AppRouteMap };
export default { AppRouter };
