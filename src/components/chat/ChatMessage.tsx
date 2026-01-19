"use client";

import clsx from "clsx";

type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
};

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={clsx("flex w-full mb-4", {
        "justify-end": isUser,
        "justify-start": !isUser,
      })}
    >
      <div
        className={clsx("flex items-end gap-2 max-w-[80%]", {
          "flex-row-reverse": isUser,
        })}
      >
        {/* アバター */}
        <div
          className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0",
            {
              "bg-blue-500": isUser,
              "bg-orange-500": !isUser,
            }
          )}
        >
          {isUser ? "👤" : "📮"}
        </div>

        {/* メッセージ本体 */}
        <div className="flex flex-col gap-1">
          <div
            className={clsx("rounded-2xl px-4 py-2 whitespace-pre-wrap", {
              "bg-blue-500 text-white rounded-br-md": isUser,
              "bg-gray-100 text-gray-800 rounded-bl-md": !isUser,
            })}
          >
            {content}
          </div>

          {/* タイムスタンプ */}
          {timestamp && (
            <span
              className={clsx("text-xs text-gray-400", {
                "text-right": isUser,
                "text-left": !isUser,
              })}
            >
              {formatTime(timestamp)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
