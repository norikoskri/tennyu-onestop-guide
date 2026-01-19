"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useTasks } from "@/contexts/TaskContext";
import { TaskCard } from "@/components/tasks";
import { BottomNav, PageHeader, PageContainer } from "@/components/layout";
import { sortTasksByPriority } from "@/lib/tasks/prioritizer";

export default function TasksPage() {
  const router = useRouter();
  const { isOnboarded } = useUser();
  const { tasks, updateTaskStatus, completedCount, totalCount } = useTasks();

  useEffect(() => {
    if (!isOnboarded) {
      router.push("/");
    }
  }, [isOnboarded, router]);

  if (!isOnboarded) {
    return null;
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
              onClick={() => router.push(`/tasks/${task.id}`)}
            />
          ))}
        </div>
      </PageContainer>

      <BottomNav />
    </div>
  );
}
