"use client";

import { UserProfile, RegionInfo } from "@/types";

interface RecommendationsProps {
  profile: UserProfile;
  region: RegionInfo | null;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  priority: number;
}

export function Recommendations({ profile, region }: RecommendationsProps) {

  const getRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // 家族構成に応じたおすすめ
    if (profile.familyType === "family_with_kids") {
      // 子どもがいる場合
      const hasInfant = profile.familyMembers?.some(
        (m) => m.relationship === "child" && m.age !== undefined && m.age < 3
      );
      const hasPreschooler = profile.familyMembers?.some(
        (m) =>
          m.relationship === "child" &&
          m.age !== undefined &&
          m.age >= 3 &&
          m.age < 6
      );
      const hasElementaryStudent = profile.familyMembers?.some(
        (m) =>
          m.relationship === "child" &&
          m.age !== undefined &&
          m.age >= 6 &&
          m.age < 12
      );

      if (hasInfant) {
        recommendations.push({
          id: "rec-infant-1",
          title: "乳幼児健診の情報",
          description: "お住まいの地域の乳幼児健診スケジュールをご確認ください",
          icon: "👶",
          link: "/guide/childcare",
          priority: 10,
        });
      }

      if (hasPreschooler) {
        recommendations.push({
          id: "rec-preschool-1",
          title: "保育園・幼稚園情報",
          description: "地域の保育施設と入園手続きについて",
          icon: "🏫",
          link: "/guide/childcare",
          priority: 9,
        });
      }

      if (hasElementaryStudent) {
        recommendations.push({
          id: "rec-school-1",
          title: "小学校の転入手続き",
          description: "転校手続きと必要書類について",
          icon: "📚",
          link: "/guide/childcare",
          priority: 9,
        });
      }

      recommendations.push({
        id: "rec-park-1",
        title: "近くの公園情報",
        description: "お子さんと遊べる公園をチェック",
        icon: "🌳",
        link: "/guide/childcare",
        priority: 7,
      });
    }

    if (profile.familyType === "couple" || profile.familyType === "family_with_kids") {
      recommendations.push({
        id: "rec-life-1",
        title: "ライフライン手続き",
        description: "電気・ガス・水道の開通手続きを忘れずに",
        icon: "💡",
        link: "/tasks",
        priority: 8,
      });
    }

    if (profile.familyType === "single") {
      recommendations.push({
        id: "rec-single-1",
        title: "近隣のスーパー・コンビニ",
        description: "一人暮らしに便利なお店情報",
        icon: "🛒",
        link: "/guide/shopping",
        priority: 7,
      });
    }

    // 関心事に応じたおすすめ
    if (profile.interests?.includes("gourmet")) {
      recommendations.push({
        id: "rec-gourmet-1",
        title: "地域のおすすめ飲食店",
        description: "地元で人気のお店をチェック",
        icon: "🍽️",
        link: "/guide/gourmet",
        priority: 5,
      });
    }

    if (profile.interests?.includes("sports")) {
      recommendations.push({
        id: "rec-sports-1",
        title: "スポーツ施設情報",
        description: "ジムや運動場の情報",
        icon: "🏃",
        link: "/guide/life",
        priority: 5,
      });
    }

    // 全員向けのおすすめ
    recommendations.push({
      id: "rec-disaster-1",
      title: "防災情報の確認",
      description: "避難所とハザードマップを確認しましょう",
      icon: "🚨",
      link: "/guide/disaster",
      priority: 6,
    });

    recommendations.push({
      id: "rec-garbage-1",
      title: "ゴミ出しルール",
      description: "地域のゴミ出し曜日と分別方法",
      icon: "🗑️",
      link: "/guide/life",
      priority: 8,
    });

    // 優先度順にソートして上位4件を返す
    return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 4);
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-sm sm:text-base font-bold text-gray-900">
          ✨ あなたへのおすすめ
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {profile.familyType === "family_with_kids"
            ? "お子さまがいるご家庭向け"
            : profile.familyType === "couple"
            ? "ご夫婦・カップル向け"
            : "一人暮らし向け"}
          の情報をピックアップ
        </p>
      </div>
      <div className="divide-y divide-gray-100">
        {recommendations.map((rec) => (
          <button
            key={rec.id}
            onClick={() => { window.location.href = rec.link; }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
          >
            <span className="text-xl sm:text-2xl flex-shrink-0">{rec.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {rec.title}
              </p>
              <p className="text-xs text-gray-500 truncate">{rec.description}</p>
            </div>
            <span className="text-gray-400 text-sm">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
