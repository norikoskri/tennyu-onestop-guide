"use client";

type QuickActionsProps = {
  actions: string[];
  onSelect: (action: string) => void;
  disabled?: boolean;
};

export function QuickActions({
  actions,
  onSelect,
  disabled = false,
}: QuickActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2 bg-gray-50">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => onSelect(action)}
          disabled={disabled}
          className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {action}
        </button>
      ))}
    </div>
  );
}
