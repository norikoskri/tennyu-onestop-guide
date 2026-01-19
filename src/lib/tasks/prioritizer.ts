// 優先度計算ロジック

import { ProcedureTask } from "@/types";

// 期限までの残り日数を計算
export function getDaysUntilDeadline(deadline: string | undefined): number | null {
  if (!deadline) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

// 期限の緊急度を判定
export function getDeadlineUrgency(
  deadline: string | undefined
): "overdue" | "urgent" | "soon" | "normal" | "none" {
  const days = getDaysUntilDeadline(deadline);

  if (days === null) return "none";
  if (days < 0) return "overdue";
  if (days <= 3) return "urgent";
  if (days <= 7) return "soon";
  return "normal";
}

// 優先度スコアを計算（数値が小さいほど優先度が高い）
export function calculatePriorityScore(task: ProcedureTask): number {
  let score = 0;

  // 優先度による基本スコア
  const priorityScores = { high: 0, medium: 100, low: 200 };
  score += priorityScores[task.priority];

  // 期限による調整
  const days = getDaysUntilDeadline(task.deadline);
  if (days !== null) {
    if (days < 0) {
      score -= 500; // 期限切れは最優先
    } else if (days <= 3) {
      score -= 100;
    } else if (days <= 7) {
      score -= 50;
    }
  }

  // ステータスによる調整
  if (task.status === "in_progress") {
    score -= 50; // 進行中のタスクを優先
  }

  return score;
}

// タスクを優先度順にソート
export function sortTasksByPriority(tasks: ProcedureTask[]): ProcedureTask[] {
  return [...tasks].sort((a, b) => {
    const scoreA = calculatePriorityScore(a);
    const scoreB = calculatePriorityScore(b);
    return scoreA - scoreB;
  });
}

// 次のおすすめアクションを取得
export function getNextRecommendedAction(
  tasks: ProcedureTask[]
): ProcedureTask | null {
  const pendingTasks = tasks.filter(
    (task) => task.status === "pending" || task.status === "in_progress"
  );

  if (pendingTasks.length === 0) {
    return null;
  }

  const sortedTasks = sortTasksByPriority(pendingTasks);
  return sortedTasks[0] || null;
}

// 期限の表示テキストを生成
export function formatDeadlineText(deadline: string | undefined): string {
  const days = getDaysUntilDeadline(deadline);

  if (days === null) return "期限なし";
  if (days < 0) return `${Math.abs(days)}日過ぎています`;
  if (days === 0) return "今日まで";
  if (days === 1) return "明日まで";
  if (days <= 7) return `あと${days}日`;

  const deadlineDate = new Date(deadline!);
  return `${deadlineDate.getMonth() + 1}/${deadlineDate.getDate()}まで`;
}

// 自動化レベルの説明
export const AUTOMATION_LEVEL_LABELS: Record<number, string> = {
  1: "案内のみ",
  2: "予約支援",
  3: "フォーム事前入力",
  4: "オンライン申請可",
};

export const AUTOMATION_LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: "必要な情報をご案内します。手続きは窓口で行ってください。",
  2: "窓口の予約をお手伝いします。",
  3: "申請フォームを事前に入力できます。",
  4: "オンラインで申請を完了できます。",
};
