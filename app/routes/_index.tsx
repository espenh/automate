import { MagicWandIcon } from "@radix-ui/react-icons";
import { Box, Flex, IconButton, ScrollArea, TextArea } from "@radix-ui/themes";
import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import React, { useCallback, useState } from "react";
import { askAssistant } from "~/apiClient/chatService";
import { useChatStore } from "~/stores/chatStore";
import { ChatSection } from "../components/chat/ChatSection";
import { AssistantThinkingMessage } from "~/components/chat/AssistantMessage";

export const meta: MetaFunction = () => {
  return [
    { title: "AutoMate" },
    {
      name: "description",
      content: "AutoMate: Driving Conversations, Accelerating Solutions.",
    },
  ];
};

export default function Index() {
  const messages = useChatStore((state) => state.messages);
  const [question, setQuestion] = useState<string>("");
  const isAssistantTyping = useChatStore((state) => state.isAssistantTyping);

  const handleQuestionChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setQuestion(event.target.value as string);
    },
    []
  );

  const handleSubmit = () => {
    if (question.trim().length > 0) {
      askAssistant(question);
    }

    setQuestion("");
  };

  return (
    <Flex
      width="100%"
      height="100%"
      justify="center"
      style={{ backgroundColor: "#2D4459", borderColor: "#023859" }}
    >
      <Box
        width="100%"
        height="100%"
        maxWidth={"1136px"}
        style={{
          backgroundColor: "#FFF2F2",
          boxShadow: "rgb(13, 13, 13) 0px 0px 4px 0px",
        }}
      >
        <Box
          style={{
            height: "100%",
            display: "grid",
            gridTemplateRows: "1fr auto",
          }}
        >
          <ScrollArea>
            <Box height="100%" p="4">
              <Flex direction="column" gap="4">
                <Flex justify="center">
                  <img src="/assets/automate-logo.png" alt="AutoMate Logo" />
                </Flex>
                {messages.map((message, index) => {
                  return <ChatSection key={index} message={message} />;
                })}
                {isAssistantTyping && <AssistantThinkingMessage />}
              </Flex>
            </Box>
          </ScrollArea>

          <Box p="4" pb="8">
            <Form onSubmit={handleSubmit}>
              <Flex align="center" gap={"2"}>
                <TextArea
                  autoFocus={true}
                  value={question}
                  onChange={handleQuestionChange}
                  style={{ width: "100%" }}
                  radius="medium"
                  placeholder="What do you want to know?"
                ></TextArea>
                <IconButton disabled={isAssistantTyping} type="submit">
                  <MagicWandIcon height="16" width="16" />
                </IconButton>
              </Flex>
            </Form>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
