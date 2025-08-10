import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import {
  getAllConversationsAction,
  getConversationMessagesAction,
  sendAdminReplyAction,
  markAdminMessagesAsReadAction,
  type ConversationWithUser,
  type AdminMessage,
} from "@/utils/supabase/chats/admin-chat";
import { useUser } from "@/app/context/UserContext";
import { getAllUsersInitiatedConversations } from "@/lib/getAllUsers";

export const useAdminChat = () => {
  const { user, userRole } = useUser();
  const [conversations, setConversations] = useState<ConversationWithUser[]>(
    []
  );
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationWithUser | null>(null);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [conversationUsers, setConversationUsers] = useState<any[]>([]);
  const [adminOnlineStatus, setAdminOnlineStatus] = useState(false);

  // Use refs to store current values for real-time subscriptions
  const conversationUsersRef = useRef<any[]>([]);
  const selectedConversationRef = useRef<ConversationWithUser | null>(null);
  const conversationsRef = useRef<ConversationWithUser[]>([]);

  const supabaseRef = useRef(createClient());

  // Update refs when state changes
  useEffect(() => {
    conversationUsersRef.current = conversationUsers;
  }, [conversationUsers]);

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // Load conversation users
  const loadConversationUsers = useCallback(async () => {
    try {
      const response = await getAllUsersInitiatedConversations();

      if (response.error) {
        console.error("Error loading conversation users:", response.error);
        return;
      }

      setConversationUsers(response.users);
    } catch (error) {
      console.error("Failed to load conversation users:", error);
    }
  }, []);

  // Load all conversations
  const loadConversations = useCallback(async () => {
    if (!user || userRole !== "admin") return;

    setIsLoading(true);
    try {
      const result = await getAllConversationsAction(user, userRole);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      setConversations(result.data || []);
    } catch (error) {
      toast.error("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  }, [user, userRole]);

  // Load messages for selected conversation
  // const loadMessages = useCallback(
  //   async (conversationId: string) => {
  //     if (!user || userRole !== "admin") return;

  //     try {
  //       const result = await getConversationMessagesAction(
  //         conversationId,
  //         user,
  //         userRole
  //       );
  //       if (result.error) {
  //         toast.error(result.error);
  //         return;
  //       }

  //       setMessages(result.data || []);

  //       // Mark messages as read
  //       await markAdminMessagesAsReadAction(conversationId, user, userRole);
  //     } catch (error) {
  //       toast.error("Failed to load messages");
  //     }
  //   },
  //   [user, userRole]
  // );

  const loadMessages = useCallback(
    async (conversationId: string) => {
      if (!user || userRole !== "admin") return;

      try {
        const result = await getConversationMessagesAction(
          conversationId,
          user,
          userRole
        );
        if (result.error) {
          toast.error(result.error);
          return;
        }

        const messages = result.data || [];

        // Optimistically mark all user messages as read locally
        const updatedMessages = messages.map((msg) =>
          msg.message_type === "user" ? { ...msg, is_read: true } : msg
        );

        setMessages(updatedMessages);

        // Also update on the backend
        // await markAdminMessagesAsReadAction(conversationId, user, userRole);
      } catch (error) {
        toast.error("Failed to load messages");
      }
    },
    [user, userRole]
  );

  // Send admin reply
  const handleSendReply = useCallback(async () => {
    if (!newMessage.trim() || !selectedConversation || !user || isSending)
      return;

    setIsSending(true);
    try {
      const result = await sendAdminReplyAction(
        selectedConversation.id,
        newMessage.trim(),
        user,
        userRole
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send reply");
    } finally {
      setIsSending(false);
    }
  }, [newMessage, selectedConversation, user, userRole, isSending]);

  // Select conversation
  const selectConversation = useCallback(
    (conversation: ConversationWithUser) => {
      setSelectedConversation(conversation);
      loadMessages(conversation.id);
    },
    [loadMessages]
  );

  // Helper function to check if a user is online
  const isUserOnline = useCallback(
    (userId: string) => {
      return onlineUsers.has(userId);
    },
    [onlineUsers]
  );

  // Get online conversation users
  const getOnlineConversationUsers = useCallback(() => {
    return conversationUsers.filter((user) => onlineUsers.has(user.id));
  }, [conversationUsers, onlineUsers]);

  // Load conversation users on mount
  useEffect(() => {
    loadConversationUsers();
  }, [loadConversationUsers]);

  // Load conversations when user/role changes
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user || userRole !== "admin") return;

    const supabase = supabaseRef.current;

    console.log("Setting up real-time subscriptions...");

    // Subscribe to new conversations and messages
    const channel = supabase
      .channel("admin-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_conversations",
        },
        (payload) => {
          console.log("Conversation change detected:", payload);
          loadConversations();
          loadConversationUsers();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("Message change detected:", payload);

          if (payload.eventType === "INSERT") {
            const newMessage = payload.new as AdminMessage;
            console.log("New message:", newMessage);

            // Show toast notification for new user messages
            if (newMessage.message_type === "user") {
              console.log("Processing user message for toast...");

              // Use ref values to get current state
              const currentUsers = conversationUsersRef.current;
              const currentSelectedConversation =
                selectedConversationRef.current;
              const currentConversations = conversationsRef.current;

              console.log("Current users:", currentUsers);
              console.log(
                "Current selected conversation:",
                currentSelectedConversation
              );

              const messageUser = currentUsers.find(
                (user) => user.id === newMessage.sender_id
              );
              console.log("Message user found:", messageUser);

              const userName =
                messageUser?.full_name ||
                messageUser?.email ||
                `User ${newMessage.sender_id?.slice(0, 8)}...`;

              const isCurrentConversation =
                currentSelectedConversation?.id === newMessage.conversation_id;
              console.log("Is current conversation:", isCurrentConversation);

              if (!isCurrentConversation) {
                console.log("Showing toast notification...");
                toast.info(`💬 New message from ${userName}`, {
                  duration: 6000,
                  description:
                    newMessage.content.length > 50
                      ? `${newMessage.content.substring(0, 50)}...`
                      : newMessage.content,
                  action: {
                    label: "View",
                    onClick: () => {
                      console.log("Toast action clicked");
                      const conversation = currentConversations.find(
                        (conv) => conv.id === newMessage.conversation_id
                      );
                      if (conversation) {
                        selectConversation(conversation);
                      }
                    },
                  },
                });
              } else {
                console.log(
                  "Not showing toast - user is viewing this conversation"
                );
              }
            }

            // Update messages if viewing the conversation
            if (
              selectedConversationRef.current &&
              newMessage.conversation_id === selectedConversationRef.current.id
            ) {
              setMessages((prev) => [...prev, newMessage]);

              if (newMessage.message_type === "user" && !newMessage.is_read) {
                markAdminMessagesAsReadAction(
                  newMessage.conversation_id,
                  user,
                  userRole
                );

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.message_type === "user"
                      ? { ...msg, is_read: true }
                      : msg
                  )
                );
              }
            }

            loadConversations();
          }

          if (payload.eventType === "UPDATE") {
            const updatedMessage = payload.new as AdminMessage;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Channel subscription status:", status);
      });

    // Enhanced presence tracking
    const presenceChannel = supabase
      .channel("online-users", {
        config: {
          presence: {
            key: user.id,
          },
        },
      })
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        const allOnlineUsers = new Set<string>();

        Object.values(state).forEach((presences: any[]) => {
          presences.forEach((presence) => {
            if (presence.user_id) {
              allOnlineUsers.add(presence.user_id);
            }
          });
        });

        setOnlineUsers(allOnlineUsers);
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        console.log("Users joined:", newPresences);
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        console.log("Users left:", leftPresences);
      })
      .subscribe(async (status) => {
        console.log("Presence channel status:", status);
        if (status !== "SUBSCRIBED") return;

        await presenceChannel.track({
          user_id: user.id,
          user_type: "admin",
          online_at: new Date().toISOString(),
        });

        setAdminOnlineStatus(true);
      });

    return () => {
      console.log("Cleaning up subscriptions...");
      setAdminOnlineStatus(false);
      presenceChannel.untrack();
      supabase.removeChannel(channel);
      supabase.removeChannel(presenceChannel);
    };
  }, [
    user,
    userRole,
    selectConversation,
    loadConversations,
    loadConversationUsers,
  ]);

  return {
    conversations,
    selectedConversation,
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    isSending,
    onlineUsers,
    conversationUsers,
    adminOnlineStatus,
    handleSendReply,
    selectConversation,
    loadConversations,
    isUserOnline,
    getOnlineConversationUsers,
  };
};
