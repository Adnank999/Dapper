"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

const UserGreetText = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch user role
        const { data: roles, error } = await supabase
          .from("user_roles")
          .select("role_id")
          .eq("profile_id", user.id);

        console.log("roles", roles);
        if (error) {
          console.error("Error fetching user roles:", error);
        } else if (roles.length > 0) {
          // Assuming you want the first role
          const roleId = roles[0].role_id;

          console.log("roleId", roleId);

           const { data: roleData, error } = await supabase
            .from('roles')
            .select("name")
            .eq('id', roleId)

            console.log("roleData", roleData);
            if ( error) {
              console.error('Error fetching role name:',  error);
            } else if (roleData.length > 0) {
              setUserRole(roleData[0].name); // Set the role name
            }

          
        }
      }
    };
    fetchUser();
  }, []);
  console.log("user", user);

  if (user !== null) {
    return (
      <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        hello&nbsp;
        <code className="font-mono font-bold">
          {user.user_metadata.full_name ?? "user"}!
        </code>
      </p>
    );
  }
  return (
    <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      Get started editing&nbsp;
      <code className="font-mono font-bold">app/page.tsx</code>
    </p>
  );
};

export default UserGreetText;
