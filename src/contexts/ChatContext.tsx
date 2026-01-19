"use client";

import {
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { ChatMessage } from "@/types";
import { useLocalStorage, STORAGE_KEYS } from "@/hooks/useLocalStorage";

type ChatContextType = {
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearHistory: () => void;
  setMessages: (messages: ChatMessage[]) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

// ユニークなIDを生成
function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setStoredMessages, clearStoredMessages] = useLocalStorage<
    ChatMessage[]
  >(STORAGE_KEYS.CHAT_HISTORY, []);

  const addMessage = useCallback(
    (message: Omit<ChatMessage, "id" | "timestamp">) => {
      const newMessage: ChatMessage = {
        ...message,
        id: generateId(),
        timestamp: Date.now(),
      };

      setStoredMessages((prev) => [...prev, newMessage]);
    },
    [setStoredMessages]
  );

  const clearHistory = useCallback(() => {
    clearStoredMessages();
  }, [clearStoredMessages]);

  const setMessages = useCallback(
    (newMessages: ChatMessage[]) => {
      setStoredMessages(newMessages);
    },
    [setStoredMessages]
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        clearHistory,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
