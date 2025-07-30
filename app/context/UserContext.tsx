"use client";
import { getUser } from "@/lib/user";

import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  user: User | null;
  userRole: string | null;
 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // let runCount = 0;
 

  useEffect(() => {
    // runCount++;
    // console.log(`[UserProvider] useEffect run count: ${runCount}`);

    const fetchUser = async () => {
      const { user, role, error } = await getUser();

      setUser(user);

      setUserRole(role);
     
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can customize this loading state
  }

  return (
    <UserContext.Provider value={{ user, userRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
