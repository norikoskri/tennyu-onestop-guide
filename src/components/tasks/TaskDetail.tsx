"use client";

import clsx from "clsx";
import { ProcedureTask } from "@/types";
import {
  getDeadlineUrgency,
  formatDeadlineText,
  AUTOMATION_LEVEL_LABELS,
  AUTOMATION_LEVEL_DESCRIPTIONS,
} from "@/lib/tasks/prioritizer";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/tasks/generator";
import {
  DocumentTextIcon,
  BuildingOfficeIcon,
  ClockIcon,
  PhoneIcon,
  GlobeAltIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

type TaskDetailProps = {
  task: ProcedureTask;
  onComplete: () => void;
};

export function TaskDetail({ task, onComplete }: TaskDetailProps) {
  const isCompleted = task.status === "completed";
  const urgency = getDeadlineUrgency(task.deadline);
  const deadlineText = formatDeadlineText(task.deadline);

  return (
    <div className="space-y-6">
      {/* ヘッダー情報 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{CATEGORY_ICONS[task.category]}</span>
          <span className="text-sm text-gray-500">
            {CATEGORY_LABELS[task.category]}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.name}</h1>
        <p className="text-gray-600">{task.description}</p>
      </div>

      {/* ステータス・期限 */}
      <div className="flex flex-wrap gap-3">
        {isCompleted ? (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircleIcon className="w-4 h-4" />
            完了済み
          </span>
        ) : (
          <>
            {task.deadline && (
              <span
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                  urgency === "overdue" && "bg-red-100 text-red-700",
                  urgency === "urgent" && "bg-orange-100 text-orange-700",
                  urgency === "soon" && "bg-yellow-100 text-yellow-700",
                  urgency === "normal" && "bg-gray-100 text-gray-700"
                )}
              >
                <ClockIcon className="w-4 h-4" />
                {deadlineText}
              </span>
            )}
          </>
        )}

        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          Lv.{task.automationLevel} {AUTOMATION_LEVEL_LABELS[task.automationLevel]}
        </span>
      </div>

      {/* 自動化レベルの説明 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          {AUTOMATION_LEVEL_DESCRIPTIONS[task.automationLevel]}
        </p>
      </div>

      {/* 必要書類 */}
      {task.requiredDocs && task.requiredDocs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
            <DocumentTextIcon className="w-5 h-5 text-gray-500" />
            必要書類
          </h2>
          <ul className="space-y-2">
            {task.requiredDocs.map((doc, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-gray-400 mt-1">•</span>
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 窓口情報 */}
      {task.officeInfo && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
            <BuildingOfficeIcon className="w-5 h-5 text-gray-500" />
            窓口情報
          </h2>
          <div className="space-y-2 text-gray-700">
            <p className="font-medium">{task.officeInfo.name}</p>
            <p className="text-sm text-gray-500">{task.officeInfo.address}</p>
            <p className="flex items-center gap-1.5 text-sm">
              <ClockIcon className="w-4 h-4 text-gray-400" />
              {task.officeInfo.hours}
            </p>
            {task.officeInfo.phone && (
              <p className="flex items-center gap-1.5 text-sm">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                {task.officeInfo.phone}
              </p>
            )}
          </div>
        </div>
      )}

      {/* オンライン申請リンク */}
      {task.onlineUrl && (
        <a
          href={task.onlineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
        >
          <GlobeAltIcon className="w-5 h-5" />
          オンラインで手続きする
        </a>
      )}

      {/* 備考 */}
      {task.notes && (
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-yellow-800">{task.notes}</p>
        </div>
      )}

      {/* 完了ボタン */}
      {!isCompleted && (
        <button
          onClick={onComplete}
          className="w-full py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
        >
          完了にする
        </button>
      )}
    </div>
  );
}
