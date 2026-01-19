"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", icon: "📊", label: "ダッシュボード" },
  { href: "/tasks", icon: "📋", label: "やること" },
  { href: "/guide", icon: "🗺️", label: "地域ガイド" },
  { href: "/", icon: "💬", label: "チャット" },
];

export function BottomNav() {
  const pathname = usePathname();

  const navigate = (href: string) => {
    window.location.href = href;
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ボトムナビゲーション - モバイル/タブレット */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 pb-safe">
          <div className="flex justify-around py-1 sm:py-2">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={clsx(
                  "flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-4 py-2 min-w-[60px] sm:min-w-[72px] transition-colors",
                  isActive(item.href)
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <span className="text-lg sm:text-xl">{item.icon}</span>
                <span
                  className={clsx(
                    "text-[10px] sm:text-xs truncate",
                    isActive(item.href) && "font-medium"
                  )}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* サイドバー - デスクトップ */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">🏠 地域ガイド</h1>
          <p className="text-xs text-gray-500 mt-1">転入者向けサポート</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                isActive(item.href)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={clsx("text-sm", isActive(item.href) && "font-medium")}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ボトムナビ分の余白 - モバイル/タブレット */}
      <div className="h-16 sm:h-20 lg:hidden" />
    </>
  );
}
