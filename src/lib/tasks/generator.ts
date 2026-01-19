// タスク自動生成ロジック

import { ProcedureTask, UserProfile, TaskStatus } from "@/types";
import proceduresData from "@/data/procedures.json";

// 条件に基づいてタスクが必要かどうかを判定
export function shouldIncludeTask(
  task: ProcedureTask,
  profile: UserProfile
): boolean {
  if (!task.conditions || task.conditions.length === 0) {
    return true;
  }

  return task.conditions.every((condition) => {
    switch (condition.type) {
      case "all":
        return true;

      case "family_type":
        return condition.operator === "equals"
          ? profile.familyType === condition.value
          : profile.familyType !== condition.value;

      case "has_children": {
        const hasChildren = profile.familyMembers.some(
          (m) => m.relationship === "child"
        );
        return condition.operator === "equals"
          ? hasChildren === condition.value
          : hasChildren !== condition.value;
      }

      case "child_age": {
        const childAges = profile.familyMembers
          .filter((m) => m.relationship === "child")
          .map((m) => m.age);
        if (childAges.length === 0) return false;
        const minAge = Math.min(...childAges);
        if (condition.operator === "less_than") {
          return minAge < (condition.value as number);
        }
        if (condition.operator === "greater_than") {
          return minAge > (condition.value as number);
        }
        return true;
      }

      default:
        return true;
    }
  });
}

// 期限を計算
export function calculateDeadline(
  task: ProcedureTask,
  moveDate: string
): string | undefined {
  if (task.deadlineType === "none") {
    return undefined;
  }
  if (task.deadlineType === "fixed" && task.deadline) {
    return task.deadline;
  }
  if (task.deadlineType === "relative" && task.relativeDays !== undefined) {
    const moveDateObj = new Date(moveDate);
    moveDateObj.setDate(moveDateObj.getDate() + task.relativeDays);
    return moveDateObj.toISOString().split("T")[0];
  }
  return undefined;
}

// プロファイルからタスクリストを生成
export function generateTasksFromProfile(
  profile: UserProfile
): ProcedureTask[] {
  const masterTasks = proceduresData.procedures as ProcedureTask[];

  return masterTasks
    .filter((task) => shouldIncludeTask(task, profile))
    .map((task) => ({
      ...task,
      status: "pending" as TaskStatus,
      deadline: calculateDeadline(task, profile.moveDate),
    }));
}

// タスクのカテゴリ別にグループ化
export function groupTasksByCategory(
  tasks: ProcedureTask[]
): Record<string, ProcedureTask[]> {
  return tasks.reduce(
    (acc, task) => {
      const category = task.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(task);
      return acc;
    },
    {} as Record<string, ProcedureTask[]>
  );
}

// カテゴリの日本語ラベル
export const CATEGORY_LABELS: Record<string, string> = {
  admin: "行政手続き",
  lifeline: "ライフライン",
  finance: "金融",
  childcare: "子育て",
  other: "その他",
};

// カテゴリのアイコン
export const CATEGORY_ICONS: Record<string, string> = {
  admin: "🏛️",
  lifeline: "💡",
  finance: "💰",
  childcare: "👶",
  other: "📋",
};
