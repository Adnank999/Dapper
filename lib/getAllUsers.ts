"use server";

import { createClient } from "@/utils/supabase/server";

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  role?: string;
  conversation_count?: number;
  last_conversation_date?: string;
}

interface GetAllUsersInitiatedConversationsResponse {
  users: UserProfile[];
  error: any;
}

export const getAllUsersInitiatedConversations = async (): Promise<GetAllUsersInitiatedConversationsResponse> => {
  const supabase = await createClient();
  
  try {
    // Single query with joins to get all data at once
    const { data: usersData, error } = await supabase
      .from("chat_conversations")
      .select(`
        user_id,
        created_at,
        profiles!user_id(*)
      `)
      .not("user_id", "is", null)


    console.log("Users Data:", usersData, "Error:", error);

    if (error) {
      console.error("Error fetching users with conversations:", error);
      return { users: [], error };
    }

    if (!usersData || usersData.length === 0) {
      console.log("No users found with conversations");
      return { users: [], error: null };
    }

    // Group by user and get unique users with conversation stats
    const userMap = new Map<string, {
      profile: any;
      conversationCount: number;
      lastConversationDate: string;
    }>();

    usersData.forEach(item => {
      const userId = item.user_id;
      const profile = item.profiles;
      
      if (userMap.has(userId)) {
        const existing = userMap.get(userId)!;
        existing.conversationCount += 1;
        // Keep the most recent conversation date
        if (item.created_at > existing.lastConversationDate) {
          existing.lastConversationDate = item.created_at;
        }
      } else {
        userMap.set(userId, {
          profile,
          conversationCount: 1,
          lastConversationDate: item.created_at,
        });
      }
    });

    // Get roles for all unique users
    const uniqueUserIds = Array.from(userMap.keys());
    
    const { data: userRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select(`
        profile_id,
        roles (
          name
        )
      `)
      .in("profile_id", uniqueUserIds);

    console.log("User Roles:", userRoles, "Error:", rolesError);

    // Create role map for quick lookup
    const roleMap = new Map<string, string>();
    if (!rolesError && userRoles) {
      userRoles.forEach(ur => {
        if (ur.roles) {
          roleMap.set(ur.profile_id, (ur.roles as any).name);
        }
      });
    }

    // Build final users array
    const users: UserProfile[] = Array.from(userMap.entries()).map(([userId, userData]) => ({
      id: userData.profile.id,
      email: userData.profile.email || '',
      full_name: userData.profile.full_name,
      avatar_url: userData.profile.avatar_url,
      created_at: userData.profile.created_at,
      role: roleMap.get(userId) || 'user',
      conversation_count: userData.conversationCount,
      last_conversation_date: userData.lastConversationDate,
    }));

    // Sort by last conversation date (most recent first)
    users.sort((a, b) => 
      new Date(b.last_conversation_date || 0).getTime() - 
      new Date(a.last_conversation_date || 0).getTime()
    );

    console.log("Final Users with Conversations:", users);

    return { users, error: null };

  } catch (error) {
    console.error("Unexpected error in getAllUsersInitiatedConversations:", error);
    return { users: [], error };
  }
};
