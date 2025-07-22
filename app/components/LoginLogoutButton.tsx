"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { signout } from "@/lib/auth-actions";


const LoginButton = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  if (user) {
    return (
      <Button
        onClick={() => {
          signout();
          setUser(null);
        }}
      >
        Log out
      </Button>
    );
  }
  return (
    <Button
       className="border border-gray-300 text-white hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md px-4 py-2"
      onClick={() => {
        router.push("auth/login");
      }}
    >
      Login
    </Button>
  );
};

export default LoginButton;
