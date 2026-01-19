"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useTasks } from "@/contexts/TaskContext";
import {
  ProgressSummary,
  NextAction,
  TaskList,
  Recommendations,
} from "@/components/dashboard";
import { BottomNav, PageHeader, PageContainer } from "@/components/layout";
import { getNextRecommendedAction } from "@/lib/tasks/prioritizer";
import { getRegionByPostalCode, getDefaultRegion } from "@/lib/utils/region";
import { RegionInfo } from "@/types";

export default function DashboardPage() {
  const { profile, isOnboarded, isInitialized } = useUser();
  const { tasks, updateTaskStatus, completedCount, totalCount } = useTasks();
  const [region, setRegion] = useState<RegionInfo | null>(null);

  useEffect(() => {
    // 初期化完了後にのみリダイレクト判定
    if (isInitialized && !isOnboarded) {
      window.location.href = "/";
    }
  }, [isInitialized, isOnboarded]);

  useEffect(() => {
    if (isOnboarded && profile) {
      const regionData = getRegionByPostalCode(profile.newAddress.postalCode);
      setRegion(regionData || getDefaultRegion());
    }
  }, [isOnboarded, profile]);

  if (!isOnboarded || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  const nextAction = getNextRecommendedAction(tasks);

  const handleCompleteTask = (id: string) => {
    updateTaskStatus(id, "completed");
  };

  const handleStatusChange = (id: string, status: "completed" | "pending") => {
    updateTaskStatus(id, status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="ダッシュボード"
        subtitle={`${profile.newAddress.prefecture}${profile.newAddress.city}への引越し`}
      />

      <PageContainer className="space-y-4 sm:space-y-6">
        <NextAction task={nextAction} onComplete={handleCompleteTask} />
        <ProgressSummary completed={completedCount} total={totalCount} />
        <Recommendations profile={profile} region={region} />
        <TaskList tasks={tasks} onStatusChange={handleStatusChange} />
      </PageContainer>

      <BottomNav />
    </div>
  );
}
