"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { ProcedureTask, TaskStatus, UserProfile } from "@/types";
import { useLocalStorage, STORAGE_KEYS } from "@/hooks/useLocalStorage";
import proceduresData from "@/data/procedures.json";

type TaskContextType = {
  tasks: ProcedureTask[];
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  generateTasks: (profile: UserProfile) => void;
  getNextAction: () => ProcedureTask | null;
  completedCount: number;
  totalCount: number;
  clearTasks: () => void;
};

const TaskContext = createContext<TaskContextType | null>(null);

// 条件に基づいてタスクが必要かどうかを判定
function shouldIncludeTask(
  task: ProcedureTask,
  profile: UserProfile
): boolean {
  if (!task.conditions || task.conditions.length === 0) {
    return true;
  }

  return task.conditions.every((condition) => {
    switch (condition.type) {
      case "all":
        return true;
      case "family_type":
        return condition.operator === "equals"
          ? profile.familyType === condition.value
          : profile.familyType !== condition.value;
      case "has_children":
        const hasChildren = profile.familyMembers.some(
          (m) => m.relationship === "child"
        );
        return condition.operator === "equals"
          ? hasChildren === condition.value
          : hasChildren !== condition.value;
      case "child_age":
        const childAges = profile.familyMembers
          .filter((m) => m.relationship === "child")
          .map((m) => m.age);
        if (childAges.length === 0) return false;
        const minAge = Math.min(...childAges);
        if (condition.operator === "less_than") {
          return minAge < (condition.value as number);
        }
        if (condition.operator === "greater_than") {
          return minAge > (condition.value as number);
        }
        return true;
      default:
        return true;
    }
  });
}

// 期限を計算
function calculateDeadline(
  task: ProcedureTask,
  moveDate: string
): string | undefined {
  if (task.deadlineType === "none") {
    return undefined;
  }
  if (task.deadlineType === "fixed" && task.deadline) {
    return task.deadline;
  }
  if (task.deadlineType === "relative" && task.relativeDays !== undefined) {
    const moveDateObj = new Date(moveDate);
    moveDateObj.setDate(moveDateObj.getDate() + task.relativeDays);
    return moveDateObj.toISOString().split("T")[0];
  }
  return undefined;
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks, clearStoredTasks] = useLocalStorage<ProcedureTask[]>(
    STORAGE_KEYS.TASKS,
    []
  );

  const generateTasks = useCallback(
    (profile: UserProfile) => {
      const masterTasks = proceduresData.procedures as ProcedureTask[];
      const generatedTasks: ProcedureTask[] = masterTasks
        .filter((task) => shouldIncludeTask(task, profile))
        .map((task) => ({
          ...task,
          status: "pending" as TaskStatus,
          deadline: calculateDeadline(task, profile.moveDate),
        }));

      setTasks(generatedTasks);
    },
    [setTasks]
  );

  const updateTaskStatus = useCallback(
    (id: string, status: TaskStatus) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? {
                ...task,
                status,
                completedAt: status === "completed" ? Date.now() : undefined,
              }
            : task
        )
      );
    },
    [setTasks]
  );

  const getNextAction = useCallback((): ProcedureTask | null => {
    const pendingTasks = tasks.filter(
      (task) => task.status === "pending" || task.status === "in_progress"
    );

    if (pendingTasks.length === 0) {
      return null;
    }

    // 優先度と期限でソート
    const sortedTasks = [...pendingTasks].sort((a, b) => {
      // 優先度でソート
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // 期限でソート
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (a.deadline) return -1;
      if (b.deadline) return 1;

      return 0;
    });

    return sortedTasks[0] || null;
  }, [tasks]);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === "completed").length,
    [tasks]
  );

  const totalCount = tasks.length;

  const clearTasks = useCallback(() => {
    clearStoredTasks();
  }, [clearStoredTasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        updateTaskStatus,
        generateTasks,
        getNextAction,
        completedCount,
        totalCount,
        clearTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
