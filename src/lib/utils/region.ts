// 地域情報ユーティリティ

import { RegionInfo } from "@/types";
import setagayaData from "@/data/regions/setagaya.json";
import yokohamaData from "@/data/regions/yokohama.json";
import fukuokaData from "@/data/regions/fukuoka.json";

// 地域データのマップ
const regionDataMap: Record<string, RegionInfo> = {
  "154": setagayaData as RegionInfo,
  "225": yokohamaData as RegionInfo,
  "810": fukuokaData as RegionInfo,
};

// 郵便番号から地域情報を取得
export function getRegionByPostalCode(postalCode: string): RegionInfo | null {
  const prefix = postalCode.substring(0, 3);
  return regionDataMap[prefix] || null;
}

// すべての地域データを取得
export function getAllRegions(): RegionInfo[] {
  return Object.values(regionDataMap);
}

// デフォルト地域を取得（世田谷区）
export function getDefaultRegion(): RegionInfo {
  return setagayaData as RegionInfo;
}
