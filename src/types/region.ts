// 地域情報の型定義

export type RegionInfo = {
  id: string;
  postalCode: string;
  prefecture: string;
  city: string;
  town: string;

  categories: RegionCategory[];
};

export type RegionCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  items: RegionItem[];
};

export type RegionItem = {
  id: string;
  title: string;
  description: string;
  details?: string;
  tags: string[]; // パーソナライズ用
  source: InfoSource;
  updatedAt: string;

  // オプション（店舗等の場合）
  location?: {
    address: string;
    lat?: number;
    lng?: number;
  };
  contact?: {
    phone?: string;
    website?: string;
  };
};

export type InfoSource = {
  type: "postal_worker" | "official" | "community";
  name?: string; // 例: "世田谷郵便局 田中さん"
  verifiedAt?: string;
};

// 情報源タイプの日本語表示用
export const INFO_SOURCE_LABELS: Record<InfoSource["type"], string> = {
  postal_worker: "配達員からの情報",
  official: "公式情報",
  community: "地元の方からの情報",
};

// 情報源タイプのアイコン
export const INFO_SOURCE_ICONS: Record<InfoSource["type"], string> = {
  postal_worker: "📮",
  official: "🏛️",
  community: "👥",
};
