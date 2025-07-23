"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

interface GetUserResponse {
  user: User | null;
  role: string | null;
  error: any;
}

export const getUser = async (): Promise<GetUserResponse> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  let userRole = null;

  if (!user) {
  console.log("No user found");
  
}
  if (user) {
    console.log("User ID:", user.id);
    const { data: roles, error } = await supabase
      .from("user_roles")
      .select("role_id")
      .eq("profile_id", user.id)

    console.log("User Roles:", roles, "Error:", error);

    if (error) {
      console.error("Error fetching user roles:", error);
    } else if (roles.length > 0) {
      const roleId = roles[0].role_id;

      const { data: roleData, error } = await supabase
        .from("roles")
        .select("name")
        .eq("id", roleId);

      if (error) {
        console.error("Error fetching role name:", error);
      } else if (roleData.length > 0) {
        userRole = roleData[0].name;
      }
    }
  }

  return { user, role: userRole, error };
};

