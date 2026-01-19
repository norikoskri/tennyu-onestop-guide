"use client";

import { useState } from "react";
import clsx from "clsx";
import { ProcedureTask, TaskCategory } from "@/types";
import {
  getDeadlineUrgency,
  formatDeadlineText,
  sortTasksByPriority,
} from "@/lib/tasks/prioritizer";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/tasks/generator";
import { CheckCircleIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolidIcon } from "@heroicons/react/24/solid";

type TaskListProps = {
  tasks: ProcedureTask[];
  onStatusChange: (id: string, status: "completed" | "pending") => void;
};

type FilterType = "all" | "pending" | "completed";

export function TaskList({ tasks, onStatusChange }: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | "all">("all");

  // フィルタリング
  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      filter === "all" ||
      (filter === "pending" && task.status !== "completed") ||
      (filter === "completed" && task.status === "completed");

    const categoryMatch =
      categoryFilter === "all" || task.category === categoryFilter;

    return statusMatch && categoryMatch;
  });

  // ソート
  const sortedTasks = sortTasksByPriority(filteredTasks);

  const categories: (TaskCategory | "all")[] = [
    "all",
    "admin",
    "lifeline",
    "finance",
    "childcare",
    "other",
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-3">やることリスト</h2>

        {/* ステータスフィルター */}
        <div className="flex gap-2 mb-3">
          {(["all", "pending", "completed"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "px-3 py-1.5 text-sm rounded-full transition-colors",
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {f === "all" && "すべて"}
              {f === "pending" && "未完了"}
              {f === "completed" && "完了済み"}
            </button>
          ))}
        </div>

        {/* カテゴリフィルター */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={clsx(
                "px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors",
                categoryFilter === cat
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {cat === "all" ? "全カテゴリ" : `${CATEGORY_ICONS[cat]} ${CATEGORY_LABELS[cat]}`}
            </button>
          ))}
        </div>
      </div>

      {/* タスク一覧 */}
      <div className="divide-y divide-gray-100">
        {sortedTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            該当するタスクがありません
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onClick={() => { window.location.href = `/tasks/${task.id}`; }}
            />
          ))
        )}
      </div>
    </div>
  );
}

// タスクアイテムコンポーネント
function TaskItem({
  task,
  onStatusChange,
  onClick,
}: {
  task: ProcedureTask;
  onStatusChange: (id: string, status: "completed" | "pending") => void;
  onClick: () => void;
}) {
  const isCompleted = task.status === "completed";
  const urgency = getDeadlineUrgency(task.deadline);
  const deadlineText = formatDeadlineText(task.deadline);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStatusChange(task.id, isCompleted ? "pending" : "completed");
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors",
        isCompleted && "opacity-60"
      )}
      onClick={onClick}
    >
      {/* チェックボックス */}
      <button onClick={handleCheckboxClick} className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircleSolidIcon className="w-6 h-6 text-green-500" />
        ) : (
          <CheckCircleIcon className="w-6 h-6 text-gray-300 hover:text-gray-400" />
        )}
      </button>

      {/* タスク情報 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">{CATEGORY_ICONS[task.category]}</span>
          <span
            className={clsx(
              "font-medium truncate",
              isCompleted ? "line-through text-gray-400" : "text-gray-900"
            )}
          >
            {task.name}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">{CATEGORY_LABELS[task.category]}</span>
          {task.deadline && !isCompleted && (
            <span
              className={clsx(
                "px-1.5 py-0.5 rounded",
                urgency === "overdue" && "bg-red-100 text-red-700",
                urgency === "urgent" && "bg-orange-100 text-orange-700",
                urgency === "soon" && "bg-yellow-100 text-yellow-700",
                urgency === "normal" && "bg-gray-100 text-gray-600"
              )}
            >
              {deadlineText}
            </span>
          )}
          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
            Lv.{task.automationLevel}
          </span>
        </div>
      </div>

      {/* 矢印 */}
      <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </div>
  );
}
