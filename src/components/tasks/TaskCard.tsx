"use client";

import clsx from "clsx";
import { ProcedureTask } from "@/types";
import {
  getDeadlineUrgency,
  formatDeadlineText,
} from "@/lib/tasks/prioritizer";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/tasks/generator";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolidIcon } from "@heroicons/react/24/solid";

type TaskCardProps = {
  task: ProcedureTask;
  onStatusChange: (id: string, status: "completed" | "pending") => void;
  onClick: () => void;
};

export function TaskCard({ task, onStatusChange, onClick }: TaskCardProps) {
  const isCompleted = task.status === "completed";
  const urgency = getDeadlineUrgency(task.deadline);
  const deadlineText = formatDeadlineText(task.deadline);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStatusChange(task.id, isCompleted ? "pending" : "completed");
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 cursor-pointer card-hover animate-fade-in-up",
        isCompleted && "opacity-60"
      )}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {/* チェックボックス */}
        <button
          onClick={handleCheckboxClick}
          className="flex-shrink-0 mt-0.5 transition-transform active:scale-90"
        >
          {isCompleted ? (
            <CheckCircleSolidIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 animate-checkmark" />
          ) : (
            <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 hover:text-gray-400" />
          )}
        </button>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          {/* カテゴリ */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{CATEGORY_ICONS[task.category]}</span>
            <span className="text-xs text-gray-500">
              {CATEGORY_LABELS[task.category]}
            </span>
          </div>

          {/* タイトル */}
          <h3
            className={clsx(
              "text-sm sm:text-base font-medium mb-1 transition-colors",
              isCompleted ? "line-through text-gray-400" : "text-gray-900"
            )}
          >
            {task.name}
          </h3>

          {/* 説明 */}
          <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2">
            {task.description}
          </p>

          {/* バッジ */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* 自動化レベル */}
            <span className="px-1.5 sm:px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] sm:text-xs font-medium rounded">
              Lv.{task.automationLevel}
            </span>

            {/* 期限 */}
            {task.deadline && !isCompleted && (
              <span
                className={clsx(
                  "px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded",
                  urgency === "overdue" && "bg-red-100 text-red-700 animate-pulse-soft",
                  urgency === "urgent" && "bg-orange-100 text-orange-700",
                  urgency === "soon" && "bg-yellow-100 text-yellow-700",
                  urgency === "normal" && "bg-gray-100 text-gray-600"
                )}
              >
                {deadlineText}
              </span>
            )}

            {/* 優先度 */}
            {task.priority === "high" && (
              <span className="px-1.5 sm:px-2 py-0.5 bg-red-50 text-red-600 text-[10px] sm:text-xs font-medium rounded">
                重要
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
