"use client";

import clsx from "clsx";

type ProgressSummaryProps = {
  completed: number;
  total: number;
};

export function ProgressSummary({ completed, total }: ProgressSummaryProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">進捗状況</h2>
        <span className="text-2xl font-bold text-blue-600">{percentage}%</span>
      </div>

      {/* プログレスバー */}
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-500",
            percentage === 100 ? "bg-green-500" : "bg-blue-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 完了数 */}
      <p className="text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{completed}</span> / {total} 件完了
      </p>

      {/* メッセージ */}
      {percentage === 100 && (
        <p className="mt-3 text-sm text-green-600 font-medium">
          🎉 すべての手続きが完了しました！
        </p>
      )}
      {percentage >= 50 && percentage < 100 && (
        <p className="mt-3 text-sm text-blue-600 font-medium">
          👍 半分以上完了しています！
        </p>
      )}
    </div>
  );
}
