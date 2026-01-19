"use client";

import { RegionCategory } from "@/types";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

type CategoryCardProps = {
  category: RegionCategory;
  onClick: () => void;
};

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl">{category.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900">{category.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">
            {category.description}
          </p>
          <p className="text-xs text-blue-500 mt-1">
            {category.items.length}件の情報
          </p>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </button>
  );
}
