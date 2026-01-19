"use client";

import { useState } from "react";
import { RegionItem } from "@/types";
import { SourceBadge } from "./SourceBadge";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

type InfoItemProps = {
  item: RegionItem;
};

export function InfoItem({ item }: InfoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* ヘッダー */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {item.description}
            </p>

            {/* タグ */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
          )}
        </div>
      </button>

      {/* 展開コンテンツ */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          {/* 詳細情報 */}
          {item.details && (
            <div className="bg-yellow-50 rounded-lg p-3">
              <p className="text-sm text-yellow-800">{item.details}</p>
            </div>
          )}

          {/* 位置情報 */}
          {item.location && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span>{item.location.address}</span>
            </div>
          )}

          {/* 連絡先 */}
          {item.contact && (
            <div className="space-y-2">
              {item.contact.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PhoneIcon className="w-4 h-4 text-gray-400" />
                  <span>{item.contact.phone}</span>
                </div>
              )}
              {item.contact.website && (
                <div className="flex items-center gap-2 text-sm">
                  <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                  <a
                    href={item.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    ウェブサイト
                  </a>
                </div>
              )}
            </div>
          )}

          {/* 情報源 */}
          <div className="flex items-center justify-between pt-2">
            <SourceBadge source={item.source} showName size="sm" />
            <span className="text-xs text-gray-400">
              更新: {item.updatedAt}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
