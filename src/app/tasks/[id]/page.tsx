"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useTasks } from "@/contexts/TaskContext";
import { TaskDetail } from "@/components/tasks";
import { BottomNav, PageHeader, PageContainer } from "@/components/layout";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isOnboarded } = useUser();
  const { tasks, updateTaskStatus } = useTasks();

  const taskId = params.id as string;
  const task = tasks.find((t) => t.id === taskId);

  useEffect(() => {
    if (!isOnboarded) {
      router.push("/");
    }
  }, [isOnboarded, router]);

  if (!isOnboarded) {
    return null;
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">タスクが見つかりません</p>
          <button
            onClick={() => router.push("/tasks")}
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
    router.push("/dashboard");
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
