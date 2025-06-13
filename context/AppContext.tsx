// context/AppContex.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

type UserRole = "student" | "teacher" | "admin";

type UserData = {
  _id: string;
  name?: string;
  email: string;
  imageUrl?: string;
  role: UserRole;
};

type UserRoleContextType = {
  role: UserRole;
  isLoading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  name:string;
  userData: UserData | null;
  refetch: () => void;
};

const AppContext = createContext<UserRoleContextType | undefined>(undefined);

export function AppContexProvider({ children }: { children: ReactNode }) {
  
  const userQueryResult = useQuery(api.users.getCurrentUser);
  

  const userData = userQueryResult ?? null;
  const role = userData?.role || "student";
  const isLoading = userQueryResult === undefined;
  const name = userData?.name || "Student"

  const contextValue = {
    role,
    name,
    isLoading,
    isAdmin: role === "admin",
    isStudent: role === "student",
    userData,
    refetch: () => {}
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContex() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContex must be used within an AppContexProvider');
  }
  return context;
}