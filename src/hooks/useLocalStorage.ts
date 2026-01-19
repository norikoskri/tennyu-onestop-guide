"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // 初期値を取得する関数
  const getStoredValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // クライアントサイドでの初期化
  useEffect(() => {
    setStoredValue(getStoredValue());
    setIsInitialized(true);
  }, [getStoredValue]);

  // 値を設定する関数
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // 値を削除する関数
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // 初期化完了前は initialValue を返す
  return [isInitialized ? storedValue : initialValue, setValue, removeValue];
}

// ストレージキーの定数
export const STORAGE_KEYS = {
  USER_PROFILE: "chiiki-guide:user-profile",
  TASKS: "chiiki-guide:tasks",
  CHAT_HISTORY: "chiiki-guide:chat-history",
  SETTINGS: "chiiki-guide:settings",
} as const;
