import { createClient } from "@/utils/supabase/server";

export default async function UserInfo() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("User Info:", user);
  if (!user) return <p>Not logged in</p>;

  return (
    <p className="text-sm">
      Hello, <strong>{user.user_metadata.full_name ?? user.email}</strong>
    </p>
  );
}