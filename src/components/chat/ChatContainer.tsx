"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { QuickActions } from "./QuickActions";
import { useUser } from "@/contexts/UserContext";
import { useTasks } from "@/contexts/TaskContext";
import { OnboardingStep, UserProfile, FamilyMember, ChatMode } from "@/types";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

type ChatContainerProps = {
  initialMode?: ChatMode;
};

export function ChatContainer({ initialMode = "onboarding" }: ChatContainerProps) {
  const router = useRouter();
  const { profile, setProfile, isOnboarded } = useUser();
  const { generateTasks } = useTasks();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [mode, setMode] = useState<ChatMode>(initialMode);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [collectedData, setCollectedData] = useState<Record<string, unknown>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // メッセージ追加ヘルパー
  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 初期化（オンボーディング開始メッセージ）
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (isOnboarded) {
      setMode("assistant");
      addMessage(
        "assistant",
        "おかえりなさい！何かお手伝いできることはありますか？"
      );
      setQuickReplies(["次にやることは？", "転入届について", "地域情報を見る"]);
    } else {
      // オンボーディング開始
      sendToApi("", "welcome");
    }
  }, [isOnboarded, addMessage]);

  // APIにメッセージを送信
  const sendToApi = async (userMessage: string, step?: OnboardingStep) => {
    setIsLoading(true);
    setQuickReplies([]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          mode,
          step: step || currentStep,
          collectedData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const { message, nextStep, extractedData, quickReplies: replies } = result.data;

        // アシスタントメッセージを追加
        addMessage("assistant", message);

        // クイックリプライを設定
        if (replies) {
          setQuickReplies(replies);
        }

        // オンボーディングの場合
        if (mode === "onboarding") {
          if (nextStep) {
            setCurrentStep(nextStep);
          }

          // データを収集
          if (extractedData) {
            // 最新のデータをマージ
            const mergedData = { ...collectedData, ...extractedData };
            setCollectedData(mergedData);

            // オンボーディング完了
            if (extractedData.onboardingCompleted === true) {
              const newProfile = createProfileFromData(mergedData);
              setProfile(newProfile);
              generateTasks(newProfile);

              // ダッシュボードへ遷移
              setTimeout(() => {
                router.push("/dashboard");
              }, 2000);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      addMessage("assistant", "申し訳ありません。エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  // ユーザーメッセージ送信
  const handleSend = (message: string) => {
    addMessage("user", message);
    sendToApi(message);
  };

  // クイックアクション選択
  const handleQuickAction = (action: string) => {
    handleSend(action);
  };

  // 収集データからプロファイルを作成
  const createProfileFromData = (data: Record<string, unknown>): UserProfile => {
    return {
      id: `user_${Date.now()}`,
      name: "",
      birthDate: "",
      oldAddress: {
        postalCode: "",
        prefecture: "",
        city: "",
        town: "",
      },
      newAddress: {
        postalCode: (data.postalCode as string) || "",
        prefecture: (data.prefecture as string) || "",
        city: (data.city as string) || "",
        town: (data.town as string) || "",
      },
      moveDate: (data.moveDate as string) || "",
      familyType: (data.familyType as UserProfile["familyType"]) || "single",
      familyMembers: (data.familyMembers as FamilyMember[]) || [],
      interests: [],
      onboardingCompleted: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 px-4 py-3 bg-blue-500 text-white">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl">
          📮
        </div>
        <div>
          <h1 className="font-bold">ゆうびん君</h1>
          <p className="text-xs text-blue-100">
            {mode === "onboarding" ? "お引越しサポート中..." : "なんでも聞いてください"}
          </p>
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}

        {/* ローディング表示 */}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm">
              📮
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* クイックアクション */}
      <QuickActions
        actions={quickReplies}
        onSelect={handleQuickAction}
        disabled={isLoading}
      />

      {/* 入力エリア */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
