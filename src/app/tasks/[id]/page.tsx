"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useTasks } from "@/contexts/TaskContext";
import { TaskDetail } from "@/components/tasks";
import { BottomNav, PageHeader, PageContainer } from "@/components/layout";

export default function TaskDetailPage() {
  const params = useParams();
  const { isOnboarded, isInitialized } = useUser();
  const { tasks, updateTaskStatus } = useTasks();

  const taskId = params.id as string;
  const task = tasks.find((t) => t.id === taskId);

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

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">タスクが見つかりません</p>
          <button
            onClick={() => { window.location.href = "/tasks"; }}
            className="text-blue-500 hover:underline"
          >
            タスク一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  const handleComplete = () => {
    updateTaskStatus(task.id, "completed");
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="手続き詳細" backHref="/tasks" />

      <PageContainer>
        <TaskDetail task={task} onComplete={handleComplete} />
      </PageContainer>

      <BottomNav />
    </div>
  );
}
