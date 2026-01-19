"use client";

import { ReactNode } from "react";
import { UserProvider } from "@/contexts/UserContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { ChatProvider } from "@/contexts/ChatContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <TaskProvider>
        <ChatProvider>{children}</ChatProvider>
      </TaskProvider>
    </UserProvider>
  );
}
