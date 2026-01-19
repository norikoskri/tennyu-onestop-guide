"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ProcedureTask } from "@/types";
import {
  getDeadlineUrgency,
  formatDeadlineText,
  AUTOMATION_LEVEL_LABELS,
} from "@/lib/tasks/prioritizer";
import { CATEGORY_ICONS } from "@/lib/tasks/generator";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

type NextActionProps = {
  task: ProcedureTask | null;
  onComplete: (id: string) => void;
};

export function NextAction({ task, onComplete }: NextActionProps) {
  const router = useRouter();

  if (!task) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🎉</span>
          <div>
            <h2 className="text-lg font-bold">すべて完了！</h2>
            <p className="text-green-100 text-sm">
              お疲れさまでした。必要な手続きはすべて完了しています。
            </p>
          </div>
        </div>
      </div>
    );
  }

  const urgency = getDeadlineUrgency(task.deadline);
  const deadlineText = formatDeadlineText(task.deadline);

  const urgencyStyles = {
    overdue: "from-red-500 to-red-600",
    urgent: "from-orange-500 to-orange-600",
    soon: "from-yellow-500 to-yellow-600",
    normal: "from-blue-500 to-blue-600",
    none: "from-blue-500 to-blue-600",
  };

  return (
    <div
      className={clsx(
        "bg-gradient-to-r rounded-xl p-6 text-white",
        urgencyStyles[urgency]
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{CATEGORY_ICONS[task.category] || "📋"}</span>
          <span className="text-sm font-medium opacity-90">
            次のおすすめアクション
          </span>
        </div>
        {task.deadline && (
          <span
            className={clsx(
              "px-3 py-1 rounded-full text-sm font-medium",
              urgency === "overdue" && "bg-white/30",
              urgency === "urgent" && "bg-white/30",
              urgency === "soon" && "bg-white/30",
              urgency === "normal" && "bg-white/20",
              urgency === "none" && "bg-white/20"
            )}
          >
            {deadlineText}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold mb-2">{task.name}</h3>
      <p className="text-white/80 text-sm mb-4">{task.description}</p>

      {/* 自動化レベル */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-medium">
          Lv.{task.automationLevel}
        </span>
        <span className="text-xs text-white/70">
          {AUTOMATION_LEVEL_LABELS[task.automationLevel]}
        </span>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/tasks/${task.id}`)}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-800 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
          詳細を見る
          <ChevronRightIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onComplete(task.id)}
          className="flex-1 bg-white/20 hover:bg-white/30 font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          完了にする
        </button>
      </div>
    </div>
  );
}
