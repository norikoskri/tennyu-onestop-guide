"use client";

import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useTasks } from "@/contexts/TaskContext";
import { TaskCard } from "@/components/tasks";
import { BottomNav, PageHeader, PageContainer } from "@/components/layout";
import { sortTasksByPriority } from "@/lib/tasks/prioritizer";

export default function TasksPage() {
  const { isOnboarded, isInitialized } = useUser();
  const { tasks, updateTaskStatus, completedCount, totalCount } = useTasks();

  useEffect(() => {
    if (isInitialized && !isOnboarded) {
      window.location.href = "/";
    }
  }, [isInitialized, isOnboarded]);

  if (!isInitialized || !isOnboarded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  const sortedTasks = sortTasksByPriority(tasks);

  const handleStatusChange = (id: string, status: "completed" | "pending") => {
    updateTaskStatus(id, status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="やることリスト"
        subtitle={`${completedCount} / ${totalCount} 件完了`}
        backHref="/dashboard"
      />

      <PageContainer>
        <div className="space-y-2 sm:space-y-3">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onClick={() => { window.location.href = `/tasks/${task.id}`; }}
            />
          ))}
        </div>
      </PageContainer>

      <BottomNav />
    </div>
  );
}
