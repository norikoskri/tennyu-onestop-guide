"use client";

import clsx from "clsx";
import { InfoSource, INFO_SOURCE_LABELS, INFO_SOURCE_ICONS } from "@/types";

type SourceBadgeProps = {
  source: InfoSource;
  showName?: boolean;
  size?: "sm" | "md";
};

export function SourceBadge({
  source,
  showName = false,
  size = "md",
}: SourceBadgeProps) {
  const colors = {
    postal_worker: "bg-orange-50 text-orange-700 border-orange-200",
    official: "bg-blue-50 text-blue-700 border-blue-200",
    community: "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1.5 border rounded-full",
        colors[source.type],
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      <span>{INFO_SOURCE_ICONS[source.type]}</span>
      <span className="font-medium">{INFO_SOURCE_LABELS[source.type]}</span>
      {showName && source.name && (
        <span className="text-gray-500">({source.name})</span>
      )}
    </div>
  );
}
