// タスク関連の型定義

export type ProcedureTask = {
  id: string;

  // 基本情報
  name: string;
  description: string;
  category: TaskCategory;

  // スケジュール
  deadline?: string; // YYYY-MM-DD
  deadlineType: "fixed" | "relative" | "none";
  relativeDays?: number; // 転入日から何日以内

  // 優先度・自動化
  priority: "high" | "medium" | "low";
  automationLevel: AutomationLevel;

  // ステータス
  status: TaskStatus;
  completedAt?: number;

  // 詳細情報
  requiredDocs: string[];
  officeInfo?: OfficeInfo;
  onlineUrl?: string;
  notes?: string;

  // 条件（誰に必要か）
  conditions: TaskCondition[];
};

export type TaskCategory =
  | "admin" // 行政
  | "lifeline" // ライフライン
  | "finance" // 金融
  | "childcare" // 子育て
  | "other"; // その他

// 自動化レベル
// 1: 案内のみ
// 2: 予約支援
// 3: フォーム事前入力
// 4: オンライン申請可
export type AutomationLevel = 1 | 2 | 3 | 4;

export type TaskStatus = "pending" | "in_progress" | "completed" | "skipped";

export type OfficeInfo = {
  name: string;
  address: string;
  hours: string;
  phone?: string;
  reservationUrl?: string;
};

export type TaskCondition = {
  type: "family_type" | "has_children" | "child_age" | "has_car" | "all";
  operator: "equals" | "includes" | "greater_than" | "less_than";
  value: string | number | boolean;
};
