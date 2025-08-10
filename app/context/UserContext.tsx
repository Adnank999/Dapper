"use client";

import { createContext, useContext } from "react";
import { User } from "@supabase/supabase-js";

interface UserContextType {
  user: User | null;
  userRole: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
  user,
  role,
}: {
  children: React.ReactNode;
  user: User | null;
  role: string | null;
}) => {


  return (
    <UserContext.Provider value={{ user, userRole:role }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
