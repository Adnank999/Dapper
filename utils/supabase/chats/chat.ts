"use server";

import { getUser } from "@/lib/user";
import { createClient } from "../server";
import { revalidatePath } from "next/cache";
import { User } from "@supabase/supabase-js";

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: "user" | "admin" | "file";
  is_read: boolean;
  created_at: string;
  sender?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface Conversation {
  id: string;
  user_id: string;
  status: "active" | "closed";
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export async function sendMessage(
  conversationId: string,
  content: string,
  messageType: "user" | "admin",
  user:User | null,
  userRole:string |null
) {
  try {
    const supabase = await createClient();

    
    if (!user) {
      return { error: "Authentication required" };
    }

    

    const { data: conversation, error: convError } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation) {
      return { error: "Conversation not found or access denied" };
    }

    // Insert message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
        message_type: messageType,
      })
      .select(
        `
        *,
        sender:profiles!messages_sender_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `
      )
      .single();

    if (messageError) {
      return { error: messageError.message };
    }

    // Update conversation's updated_at timestamp
    await supabase
      .from("chat_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    revalidatePath("/chat");
    return { data: message };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }
}

// Get or create conversation for current user
export async function getOrCreateConversation(user: User | null) {
  try {
    const supabase = await createClient();
    
  
    
    if (!user) {
      return { error: "Authentication required" };
    }

    // Use upsert to get or create
    const { data: conversation, error: upsertError } = await supabase
      .from('chat_conversations')
      .upsert({
        user_id: user?.id,
        status: 'active'
      }, {
        onConflict: 'user_id,status',
        ignoreDuplicates: false
      })
      .select(`
        *,
        user:profiles!chat_conversations_user_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (upsertError) {
      return { error: upsertError.message };
    }

    revalidatePath('/chat');
    return { data: conversation };

  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    return { error: "Failed to get conversation" };
  }
}

// Get messages for a conversation
export async function getMessages(
  conversationId: string,
  page: number = 0,
  limit: number = 50
) {
  try {
    const supabase = await createClient();

    // Get current user
    const { user, role, error: authError } = await getUser();
    if (authError || !user) {
      return { error: "Authentication required" };
    }

    const offset = page * limit;

    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:profiles!messages_sender_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (messagesError) {
      return { error: messagesError.message };
    }

    return { data: messages?.reverse() || [] };
  } catch (error) {
    console.error("Error getting messages:", error);
    return { error: "Failed to get messages" };
  }
}

// Mark messages as read
export async function markMessagesAsRead(conversationId: string,user: User | null,userRole: String| null) {
  try {
    const supabase = await createClient();

 
    if (!user) {
      return { error: "Authentication required" };
    }

    // Mark all unread messages in this conversation as read (except own messages)
    const { error: updateError } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .eq("message_type", "admin")
      .eq("is_read", false)
     

    if (updateError) {
      return { error: updateError.message };
    }

    // revalidatePath("/chat");
    return { success: true };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { error: "Failed to mark messages as read" };
  }
}


// // Close conversation (admin only)
// export async function closeConversation(conversationId: string) {
//   try {
//     const supabase = await createClient();

//     // Get current user
//    const { user, role, error: authError } = await getUser();
//     if (authError || !user) {
//       return { error: "Authentication required" };
//     }

//     // Check if user is admin
//     const { data: isAdminResult, error: adminError } = await supabase.rpc(
//       "is_admin",
//       { user_id: user.id }
//     );

//     if (adminError || !isAdminResult) {
//       return { error: "Admin access required" };
//     }

//     // Close the conversation
//     const { error: updateError } = await supabase
//       .from("chat_conversations")
//       .update({
//         status: "closed",
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", conversationId);

//     if (updateError) {
//       return { error: updateError.message };
//     }

//     revalidatePath("/chat");
//     revalidatePath("/admin/chat");
//     return { success: true };
//   } catch (error) {
//     console.error("Error closing conversation:", error);
//     return { error: "Failed to close conversation" };
//   }
// }

// // Get all conversations (admin only)
// export async function getAllConversations(
//   status: "active" | "closed" | "all" = "active"
// ) {
//   try {
//     const supabase = await createClient();

//     // Get current user
//     const { user, role, error: authError } = await getUser();
//     if (authError || !user) {
//       return { error: "Authentication required" };
//     }

//     // Check if user is admin
//     const { data: isAdminResult, error: adminError } = await supabase.rpc(
//       "is_admin",
//       { user_id: user.id }
//     );

//     if (adminError || !isAdminResult) {
//       return { error: "Admin access required" };
//     }

//     let query = supabase
//       .from("chat_conversations")
//       .select(
//         `
//         *,
//         user:profiles!chat_conversations_user_id_fkey(
//           id,
//           full_name,
//           avatar_url
//         ),
//         messages(
//           id,
//           content,
//           created_at,
//           is_read,
//           sender_id
//         )
//       `
//       )
//       .order("updated_at", { ascending: false });

//     if (status !== "all") {
//       query = query.eq("status", status);
//     }

//     const { data: conversations, error: conversationsError } = await query;

//     if (conversationsError) {
//       return { error: conversationsError.message };
//     }

//     // Get unread message count for each conversation
//     const conversationsWithUnread =
//       conversations?.map((conv) => ({
//         ...conv,
//         unread_count:
//           conv.messages?.filter(
//             (msg: any) => !msg.is_read && msg.sender_id !== user.id
//           ).length || 0,
//         last_message: conv.messages?.[conv.messages.length - 1] || null,
//       })) || [];

//     return { data: conversationsWithUnread };
//   } catch (error) {
//     console.error("Error getting conversations:", error);
//     return { error: "Failed to get conversations" };
//   }
// }

// // Get conversation by ID
// export async function getConversation(conversationId: string) {
//   try {
//     const supabase = await createClient();

//     // Get current user
//    const { user, role, error: authError } = await getUser();
//     if (authError || !user) {
//       return { error: "Authentication required" };
//     }

//     const { data: conversation, error: convError } = await supabase
//       .from("chat_conversations")
//       .select(
//         `
//         *,
//         user:profiles!chat_conversations_user_id_fkey(
//           id,
//           full_name,
//           avatar_url
//         )
//       `
//       )
//       .eq("id", conversationId)
//       .single();

//     if (convError) {
//       return { error: convError.message };
//     }

//     return { data: conversation };
//   } catch (error) {
//     console.error("Error getting conversation:", error);
//     return { error: "Failed to get conversation" };
//   }
// }

// // Get unread message count for user
// export async function getUnreadMessageCount() {
//   try {
//     const supabase = await createClient();

//     // Get current user
//     const { user, role, error: authError } = await getUser();
//     if (authError || !user) {
//       return { error: "Authentication required" };
//     }

//     // Check if user is admin
//     const { data: isAdminResult } = await supabase.rpc("is_admin", {
//       user_id: user.id,
//     });

//     let query;

//     if (isAdminResult) {
//       // Admin: count all unread messages from users
//       query = supabase
//         .from("messages")
//         .select("id", { count: "exact", head: true })
//         .eq("is_read", false)
//         .neq("sender_id", user.id);
//     } else {
//       // User: count unread messages in their conversations
//       query = supabase
//         .from("messages")
//         .select(
//           `
//           id,
//           conversation_id!inner(user_id)
//         `,
//           { count: "exact", head: true }
//         )
//         .eq("is_read", false)
//         .eq("conversation_id.user_id", user.id)
//         .neq("sender_id", user.id);
//     }

//     const { count, error: countError } = await query;

//     if (countError) {
//       return { error: countError.message };
//     }

//     return { data: count || 0 };
//   } catch (error) {
//     console.error("Error getting unread count:", error);
//     return { error: "Failed to get unread count" };
//   }
// }
