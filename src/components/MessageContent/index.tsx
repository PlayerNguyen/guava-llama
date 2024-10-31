import { Flex, Text } from "@mantine/core";
import clsx from "clsx";
import { ReactNode } from "react";
import "./message-content.css";

/**
 * Represents a message content partial components.
 */
export default function MessageContent() {
  return <></>;
}

type MessageContentWrapperProps = {
  /**
   * Content of the message.
   */
  children?: React.ReactNode;
  /**
   * Justify to
   */
  justify?: "start" | "end";
  /**
   * Wrapper class name.
   */
  innerClassName?: string;
};

MessageContent.Wrapper = function ({
  justify,
  innerClassName,
  children,
}: MessageContentWrapperProps) {
  return (
    <Flex direction={"row"} justify={justify}>
      <Flex
        direction={`column`}
        align={`end`}
        gap={4}
        className={clsx(
          "border-solid border border-neutral-200 rounded-xl p-3 shadow-sm",
          `hover:shadow-md`,
          `transition-shadow`,
          `max-w-[50vw]`,
          innerClassName
        )}
      >
        {children}
      </Flex>
    </Flex>
  );
};

type MessageContentLabelProps = {
  /**
   * Content of the message.
   */
  children?: ReactNode;
};

MessageContent.Label = function ({ children }: MessageContentLabelProps) {
  return (
    <Text size={"sm"} fw={600} className={clsx("text-neutral-700")}>
      {children}
    </Text>
  );
};

export type MessageContentContentProps = {
  children: string | TrustedHTML;
};

MessageContent.Content = function ({ children }: MessageContentContentProps) {
  return (
    <Text
      size="sm"
      className={clsx("message-content-inner")}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
};

export type MessageContentUserProps = {
  content: string;
  label?: string;
};

MessageContent.User = function ({ content, label }: MessageContentUserProps) {
  return (
    <MessageContent.Wrapper justify="end">
      <>
        {/* render the label */}
        {label && <MessageContent.Label>{label}</MessageContent.Label>}
        {/* Content */}
        <MessageContent.Content>{content}</MessageContent.Content>
      </>
    </MessageContent.Wrapper>
  );
};

MessageContent.System = function ({ content, label }: MessageContentUserProps) {
  return (
    <MessageContent.Wrapper justify="start">
      <>
        {/* render the label */}
        {label && <MessageContent.Label>{label}</MessageContent.Label>}
        {/* Content */}
        <MessageContent.Content>{content}</MessageContent.Content>
      </>
    </MessageContent.Wrapper>
  );
};
