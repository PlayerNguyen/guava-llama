import { AppRouteMap } from "@/router";
import { ActionIcon, Flex } from "@mantine/core";
import { startTransition } from "react";
import { IconContext } from "react-icons";
import { TbArticle } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

/**
 * Represents a single item in the application sidebar.
 */
export type AppSidebarItem = {
  /**
   * A unique identifier for the sidebar item, used as its key.
   */
  key: string;

  /**
   * The icon associated with this sidebar item, typically an image or SVG.
   */
  icon: React.ReactElement;

  /**
   * An alternate text description of the icon, useful for accessibility purposes.
   */
  alt: string;
};

/**
 * AppSideBar component.
 *
 * Renders the app sidebar navigation menu with icons and handles click events.
 */
export default function AppSideBar() {
  const APP_SIDEBAR_ITEMS: AppSidebarItem[] = [
    {
      key: AppRouteMap.Sessions,
      icon: <TbArticle />,
      alt: "Sessions",
    },
  ];
  const SIDEBAR_BUTTON_SIZE = 24;

  const navigate = useNavigate();

  /**
   * Handles the click event on an AppSidebar item.
   *
   * Navigates to the corresponding key using the `navigate` function,
   * after starting a transition to ensure smooth navigation.
   */
  function handleOnClick(value: AppSidebarItem) {
    startTransition(() => {
      navigate(value.key);
    });
  }

  return (
    <IconContext.Provider value={{ size: String(SIDEBAR_BUTTON_SIZE) }}>
      <Flex
        direction={"column"}
        align={"center"}
        pt={"20vh"}
        className="bg-neutral-100 h-[100vh] w-[48px] z-50 shadow-md border-0 border-r border-solid border-neutral-300"
      >
        {/* Render app sidebar item */}
        {APP_SIDEBAR_ITEMS.map((value: AppSidebarItem) => {
          return (
            <ActionIcon
              variant="transparent"
              key={value.key}
              size={SIDEBAR_BUTTON_SIZE}
              onClick={() => handleOnClick(value)}
            >
              {value.icon}
            </ActionIcon>
          );
        })}
      </Flex>
    </IconContext.Provider>
  );
}
