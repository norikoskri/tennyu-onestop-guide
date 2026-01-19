"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { InfoItem } from "@/components/guide";
import { BottomNav, PageHeader, PageContainer } from "@/components/layout";
import { getRegionByPostalCode, getDefaultRegion } from "@/lib/utils/region";
import { RegionInfo, RegionCategory } from "@/types";

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { profile, isOnboarded } = useUser();
  const [region, setRegion] = useState<RegionInfo | null>(null);

  const categoryId = params.category as string;

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

  const category = region.categories.find(
    (c: RegionCategory) => c.id === categoryId
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">カテゴリが見つかりません</p>
          <button
            onClick={() => router.push("/guide")}
            className="text-blue-500 hover:underline"
          >
            地域ガイドに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={category.name}
        subtitle={category.description}
        icon={category.icon}
        backHref="/guide"
      />

      <PageContainer>
        <div className="space-y-2 sm:space-y-3">
          {category.items.map((item) => (
            <InfoItem key={item.id} item={item} />
          ))}
        </div>

        {category.items.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">
              このカテゴリの情報はまだありません
            </p>
          </div>
        )}
      </PageContainer>

      <BottomNav />
    </div>
  );
}
