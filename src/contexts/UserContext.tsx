"use client";

import {
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { UserProfile } from "@/types";
import { useLocalStorage, STORAGE_KEYS } from "@/hooks/useLocalStorage";

type UserContextType = {
  profile: UserProfile | null;
  updateProfile: (data: Partial<UserProfile>) => void;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  isOnboarded: boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setStoredProfile, clearStoredProfile] =
    useLocalStorage<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);

  const updateProfile = useCallback(
    (data: Partial<UserProfile>) => {
      setStoredProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          ...data,
          updatedAt: Date.now(),
        };
      });
    },
    [setStoredProfile]
  );

  const setProfile = useCallback(
    (newProfile: UserProfile) => {
      setStoredProfile({
        ...newProfile,
        createdAt: newProfile.createdAt || Date.now(),
        updatedAt: Date.now(),
      });
    },
    [setStoredProfile]
  );

  const clearProfile = useCallback(() => {
    clearStoredProfile();
  }, [clearStoredProfile]);

  const isOnboarded = profile?.onboardingCompleted ?? false;

  return (
    <UserContext.Provider
      value={{
        profile,
        updateProfile,
        setProfile,
        clearProfile,
        isOnboarded,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
