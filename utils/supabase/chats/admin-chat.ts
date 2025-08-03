"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export interface ConversationWithUser {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string;
  };
  unread_count?: number;
  last_message?: {
    content: string;
    created_at: string;
  };
}

export interface AdminMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: "user" | "admin";
  created_at: string;
  is_read: boolean;
  sender: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string;
  };
}

// Server action to get all conversations for admin
export async function getAllConversationsAction(
  user: User | null,
  userRole: String | null
) {
  try {
    const supabase = await createClient();

    if (!user) {
      return { error: "Unauthorized" };
    }

    if (userRole !== "admin") {
      return { error: "Forbidden - Admin access required" };
    }

    const { data: conversations, error } = await supabase
      .from("chat_conversations")
      .select(
        `
        *,
         user : profiles!user_id(*)
      `
      )
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return { error: error.message };
    }

    // Get unread count and last message for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        // Get unread count (messages from user that admin hasn't read)
        const { count: unreadCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("message_type", "admin")
          .eq("is_read", false);

        // Get last message
        const { data: lastMessage } = await supabase
          .from("messages")
          .select("content, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          ...conv,
          unread_count: unreadCount || 0,
          last_message: lastMessage,
        };
      })
    );

    return { data: conversationsWithDetails };
  } catch (error) {
    console.error("Error in getAllConversationsAction:", error);
    return { error: "Failed to fetch conversations" };
  }
}

// Server action to get messages for a specific conversation
export async function getConversationMessagesAction(
  conversationId: string,
  user: User | null,
  userRole: String | null
) {
  try {
    const supabase = await createClient();

    if (!user) {
      return { error: "Unauthorized" };
    }

    if (userRole !== "admin") {
      return { error: "Forbidden - Admin access required" };
    }

    const { data: messages, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender: profiles!sender_id(*)
      `
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return { error: error.message };
    }

    return { data: messages as AdminMessage[] };
  } catch (error) {
    console.error("Error in getConversationMessagesAction:", error);
    return { error: "Failed to fetch messages" };
  }
}

// Server action to send admin reply
export async function sendAdminReplyAction(
  conversationId: string,
  content: string,
  user: User | null,
  userRole: String | null
) {
  try {
    const supabase = await createClient();

    if (!user) {
      return { error: "Unauthorized" };
    }

    if (userRole !== "admin") {
      return { error: "Forbidden - Admin access required" };
    }

    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        message_type: "admin",
      })
      .select(
        `
        *,
        sender:profiles!sender_id(*)
      `
      )
      .single();

    if (error) {
      console.error("Error sending admin reply:", error);
      return { error: error.message };
    }

    // Update conversation updated_at
    await supabase
      .from("chat_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    // revalidatePath('/admin/chat')
    return { data: message as AdminMessage };
  } catch (error) {
    console.error("Error in sendAdminReplyAction:", error);
    return { error: "Failed to send reply" };
  }
}

// Server action to mark messages as read by admin
export async function markAdminMessagesAsReadAction(
  conversationId: string,
  user: User | null,
  userRole: String | null
) {
  try {
    const supabase = await createClient();

    if (!user) {
      return { error: "Unauthorized" };
    }

    if (userRole !== "admin") {
      return { error: "Forbidden - Admin access required" };
    }

    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .eq("message_type", "user")
      .eq("is_read", false);

    if (error) {
      console.error("Error marking messages as read:", error);
      return { error: error.message };
    }

    // revalidatePath('/admin/chat')
    return { success: true };
  } catch (error) {
    console.error("Error in markAdminMessagesAsReadAction:", error);
    return { error: "Failed to mark messages as read" };
  }
}




// Server action to get conversation by ID
export async function getConversationByIdAction(
  conversationId: string,
  user: User | null,
  userRole: String | null
) {
  try {
    const supabase = await createClient();

    if (!user) {
      return { error: "Unauthorized" };
    }

    if (userRole !== "admin") {
      return { error: "Forbidden - Admin access required" };
    }

    const { data: conversation, error } = await supabase
      .from("chat_conversations")
      .select(
        `
        *,
        user:profiles(
          id,
          full_name,
          avatar_url,
          email
        )
      `
      )
      .eq("id", conversationId)
      .single();

    if (error) {
      console.error("Error fetching conversation:", error);
      return { error: error.message };
    }

    return { data: conversation as ConversationWithUser };
  } catch (error) {
    console.error("Error in getConversationByIdAction:", error);
    return { error: "Failed to fetch conversation" };
  }
}
