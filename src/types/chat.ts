// チャット関連の型定義

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;

  // AI応答の場合
  intent?: AIIntent;
  actions?: AIAction[];

  // UIヒント
  quickReplies?: string[];
  showConfirmation?: boolean;
};

export type AIIntent =
  | "greeting"
  | "collect_info"
  | "confirm_info"
  | "suggest_action"
  | "answer_question"
  | "update_status"
  | "provide_info";

export type AIAction = {
  type: "update_profile" | "complete_task" | "navigate" | "show_detail";
  payload: Record<string, unknown>;
};

// オンボーディングのステップ
export type OnboardingStep =
  | "welcome"
  | "postal_code"
  | "move_date"
  | "family_type"
  | "family_members"
  | "interests"
  | "confirm"
  | "complete";

// チャットモード
export type ChatMode = "onboarding" | "assistant";
