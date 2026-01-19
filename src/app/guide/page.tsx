"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { CategoryCard, TopicCard, GENBA_CHI_TOPICS } from "@/components/guide";
import { BottomNav, PageHeader, PageContainer } from "@/components/layout";
import { getRegionByPostalCode, getDefaultRegion } from "@/lib/utils/region";
import { RegionInfo } from "@/types";

export default function GuidePage() {
  const { profile, isOnboarded } = useUser();
  const [region, setRegion] = useState<RegionInfo | null>(null);

  useEffect(() => {
    if (isOnboarded && profile) {
      const regionData = getRegionByPostalCode(profile.newAddress.postalCode);
      setRegion(regionData || getDefaultRegion());
    } else {
      setRegion(getDefaultRegion());
    }
  }, [isOnboarded, profile]);

  if (!region) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="地域ガイド"
        subtitle={`${region.prefecture}${region.city} ${region.town}`}
        backHref="/dashboard"
      />

      <PageContainer>
        {/* 現場知トピック */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl">📮</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                郵便局員の「現場知」
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-500">
                配達員ならではの地域情報をピックアップ
              </p>
            </div>
          </div>

          {/* 横スクロールできるトピックカード */}
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6">
            {GENBA_CHI_TOPICS.map((topic) => (
              <div key={topic.id} className="flex-shrink-0 w-64 sm:w-72">
                <TopicCard
                  topic={topic}
                  onClick={() => { window.location.href = topic.link; }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* カテゴリ一覧 */}
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
            カテゴリから探す
          </h2>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {region.categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => { window.location.href = `/guide/${category.id}`; }}
            />
          ))}
        </div>
      </PageContainer>

      <BottomNav />
    </div>
  );
}
