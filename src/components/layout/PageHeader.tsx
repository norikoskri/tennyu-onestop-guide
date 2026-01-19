"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  backHref,
  icon,
  actions,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 lg:ml-64 lg:max-w-none lg:mr-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {backHref && (
            <button
              onClick={() => router.push(backHref)}
              className="p-1.5 sm:p-2 -ml-1.5 sm:-ml-2 text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {icon && <span className="text-xl sm:text-2xl flex-shrink-0">{icon}</span>}
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-500 truncate">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
