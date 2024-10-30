import { Flex } from "@mantine/core";
import { Outlet } from "react-router-dom";
import AppSideBar from "../AppSideBar";

/**
 * Represents an application layout.
 */
export default function AppLayout() {
  return (
    <>
      <Flex direction={"row"}>
        {/* Side bar */}
        <AppSideBar />
        {/* Main content of each routes */}
        <Outlet />
      </Flex>
    </>
  );
}
