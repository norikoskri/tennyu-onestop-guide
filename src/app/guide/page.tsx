"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { CategoryCard } from "@/components/guide";
import { BottomNav, PageHeader, PageContainer } from "@/components/layout";
import { getRegionByPostalCode, getDefaultRegion } from "@/lib/utils/region";
import { RegionInfo } from "@/types";

export default function GuidePage() {
  const router = useRouter();
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
        {/* 説明 */}
        <div className="bg-orange-50 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
          <span className="text-xl sm:text-2xl">📮</span>
          <div>
            <p className="text-xs sm:text-sm text-orange-800 font-medium mb-0.5 sm:mb-1">
              郵便局員からの「現場知」情報
            </p>
            <p className="text-[10px] sm:text-xs text-orange-700">
              毎日地域を回る配達員ならではの生活に役立つ情報をお届けします
            </p>
          </div>
        </div>

        {/* カテゴリ一覧 */}
        <div className="space-y-2 sm:space-y-3">
          {region.categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => router.push(`/guide/${category.id}`)}
            />
          ))}
        </div>
      </PageContainer>

      <BottomNav />
    </div>
  );
}
