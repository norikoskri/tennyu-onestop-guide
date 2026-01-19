"use client";

import clsx from "clsx";
import { AutomationLevel as AutomationLevelType } from "@/types";
import {
  AUTOMATION_LEVEL_LABELS,
  AUTOMATION_LEVEL_DESCRIPTIONS,
} from "@/lib/tasks/prioritizer";

type AutomationLevelProps = {
  level: AutomationLevelType;
  showDescription?: boolean;
  size?: "sm" | "md" | "lg";
};

export function AutomationLevel({
  level,
  showDescription = false,
  size = "md",
}: AutomationLevelProps) {
  const colors = {
    1: "bg-gray-100 text-gray-700",
    2: "bg-blue-100 text-blue-700",
    3: "bg-green-100 text-green-700",
    4: "bg-purple-100 text-purple-700",
  };

  const sizes = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <div>
      <span
        className={clsx(
          "inline-flex items-center gap-1 font-medium rounded",
          colors[level],
          sizes[size]
        )}
      >
        <span>Lv.{level}</span>
        <span>{AUTOMATION_LEVEL_LABELS[level]}</span>
      </span>

      {showDescription && (
        <p className="mt-1 text-sm text-gray-500">
          {AUTOMATION_LEVEL_DESCRIPTIONS[level]}
        </p>
      )}
    </div>
  );
}
