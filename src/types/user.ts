// ユーザー関連の型定義

export type UserProfile = {
  id: string;

  // 基本情報
  name: string;
  birthDate: string; // YYYY-MM-DD

  // 住所情報
  oldAddress: Address;
  newAddress: Address;
  moveDate: string; // YYYY-MM-DD（転入予定日）

  // 家族構成
  familyType: FamilyType;
  familyMembers: FamilyMember[];

  // パーソナライズ
  interests: Interest[];

  // メタ情報
  onboardingCompleted: boolean;
  createdAt: number;
  updatedAt: number;
};

export type Address = {
  postalCode: string; // ハイフンなし7桁
  prefecture: string;
  city: string;
  town: string;
  street?: string;
};

export type FamilyType = "single" | "couple" | "family_with_kids" | "senior";

export type FamilyMember = {
  id: string;
  relationship: "spouse" | "child" | "parent" | "other";
  birthDate: string;
  age: number; // 自動計算
};

export type Interest =
  | "childcare" // 子育て
  | "medical" // 医療
  | "shopping" // 買い物
  | "gourmet" // グルメ
  | "sports" // スポーツ
  | "culture"; // 文化・趣味
