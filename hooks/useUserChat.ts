import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import {
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  type Message,
  type Conversation,
} from "@/utils/supabase/chats/chat";
import { useUser } from "@/app/context/UserContext";

interface AdminPresence {
  user_id: string;
  user_type: "admin";
  online_at: string;
  last_seen?: string;
  status?: "online" | "away" | "busy";
}

interface UserPresence {
  user_id: string;
  user_type: "user";
  online_at: string;
  conversation_id?: string;
}

export const useUserChat = () => {
  const { user, userRole } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Enhanced admin status tracking
  const [adminPresenceState, setAdminPresenceState] = useState<{
    isOnline: boolean;
    totalAdmins: number;
    onlineAdmins: AdminPresence[];
    lastSeen?: string;
    averageResponseTime?: string;
  }>({
    isOnline: false,
    totalAdmins: 0,
    onlineAdmins: [],
  });

  const [userOnlineStatus, setUserOnlineStatus] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const presenceChannelRef = useRef<any>(null);
  const messageChannelRef = useRef<any>(null);

  // Initialize conversation when chat opens
  // const initializeConversation = useCallback(async () => {
  //   if (!user) return;

  //   setIsLoading(true);
  //   try {
  //     const result = await getOrCreateConversation(user);
  //     if (result.error) {
  //       toast.error(result.error);
  //       return;
  //     }

  //     setConversation(result.data);

  //     // Load messages
  //     const messagesResult = await getMessages(result.data.id);
  //     if (messagesResult.error) {
  //       toast.error(messagesResult.error);
  //       return;
  //     }

  //     setMessages(messagesResult.data);

  //     // Mark admin messages as read
  //     await markMessagesAsRead(result.data.id, user, userRole);
  //   } catch (error) {
  //     console.error('Failed to initialize chat:', error);
  //     toast.error('Failed to initialize chat');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [user, userRole]);

  const initializeConversation = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const result = await getOrCreateConversation(user);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      setConversation(result.data);

      // Load messages
      const messagesResult = await getMessages(result.data.id);
      if (messagesResult.error) {
        toast.error(messagesResult.error);
        return;
      }

      let updatedMessages = messagesResult.data;

      // Mark admin messages as read
      await markMessagesAsRead(result.data.id, user, userRole);

      // 🔄 Update local message state with is_read = true for user messages
      updatedMessages = updatedMessages?.map((msg: any) => {
        if (msg.message_type === "admin") {
          return { ...msg, is_read: true };
        }
        return msg;
      });

      setMessages(updatedMessages);
    } catch (error) {
      console.error("Failed to initialize chat:", error);
      toast.error("Failed to initialize chat");
    } finally {
      setIsLoading(false);
    }
  }, [user, userRole]);

  // Enhanced admin presence tracking with detailed status
  const updateAdminPresenceState = useCallback((presenceState: any) => {
    const onlineAdmins: AdminPresence[] = [];
    let totalAdminsFound = 0;

    // Process all presence entries to find admins
    Object.values(presenceState).forEach((presences: any[]) => {
      presences.forEach((presence) => {
        if (presence.user_type === "admin") {
          totalAdminsFound++;
          onlineAdmins.push({
            user_id: presence.user_id,
            user_type: "admin",
            online_at: presence.online_at,
            last_seen: presence.last_seen,
            status: presence.status || "online",
          });
        }
      });
    });

    // Calculate average response time based on admin activity
    const averageResponseTime =
      onlineAdmins.length > 0 ? "< 5 min" : "2-4 hours";

    setAdminPresenceState({
      isOnline: onlineAdmins.length > 0,
      totalAdmins: totalAdminsFound,
      onlineAdmins,
      averageResponseTime,
      lastSeen:
        onlineAdmins.length === 0 ? new Date().toISOString() : undefined,
    });
  }, []);

  // Enhanced presence tracking with shared channel coordination
  const setupPresenceTracking = useCallback(async () => {
    if (!user) return;

    setConnectionStatus("connecting");

    try {
      // Clean up existing channels
      if (presenceChannelRef.current) {
        await presenceChannelRef.current.untrack();
        supabase.removeChannel(presenceChannelRef.current);
      }

      // Use the SAME channel name as admin but with user-specific tracking
      // This ensures both admin and user hooks can see each other's presence
      presenceChannelRef.current = supabase
        .channel("online-users", {
          config: {
            presence: {
              key: user.id,
            },
          },
        })
        .on("presence", { event: "sync" }, () => {
          const state = presenceChannelRef.current?.presenceState();
          if (state) {
            updateAdminPresenceState(state);
          }
        })
        .on("presence", { event: "join" }, ({ newPresences }) => {
          // Handle admin joining
          const adminJoined = newPresences.some(
            (presence: any) => presence.user_type === "admin"
          );

          if (adminJoined) {
            const state = presenceChannelRef.current?.presenceState();
            if (state) {
              updateAdminPresenceState(state);
            }
            // Show notification that admin is now available
            toast.success("Support team is now online!", {
              duration: 3000,
            });
          }
        })
        .on("presence", { event: "leave" }, ({ leftPresences }) => {
          // Handle admin leaving
          const adminLeft = leftPresences.some(
            (presence: any) => presence.user_type === "admin"
          );

          if (adminLeft) {
            const state = presenceChannelRef.current?.presenceState();
            if (state) {
              updateAdminPresenceState(state);
            }
          }
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            setConnectionStatus("connected");

            // Track user presence - this will be visible to admin hook
            await presenceChannelRef.current?.track({
              user_id: user.id,
              user_type: "user",
              online_at: new Date().toISOString(),
              conversation_id: conversation?.id,
              last_activity: new Date().toISOString(),
            });

            setUserOnlineStatus(true);
          } else if (status === "CHANNEL_ERROR") {
            setConnectionStatus("disconnected");
            toast.error("Connection lost. Trying to reconnect...");

            // Attempt reconnection after delay
            setTimeout(() => {
              setupPresenceTracking();
            }, 3000);
          }
        });
    } catch (error) {
      console.error("Failed to setup presence tracking:", error);
      setConnectionStatus("disconnected");
      toast.error("Failed to connect to real-time updates");
    }
  }, [user, conversation?.id, updateAdminPresenceState]);

  // Enhanced message subscription with better error handling
  const setupMessageSubscription = useCallback(() => {
    if (!conversation || !user) return;

    // Clean up existing message channel
    if (messageChannelRef.current) {
      supabase.removeChannel(messageChannelRef.current);
    }

    // Use unique channel name to avoid conflicts with admin hook
    messageChannelRef.current = supabase
      .channel(`user-messages-${conversation.id}-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        async (payload) => {
          try {
            if (payload.eventType === "INSERT") {
              const newMessage = payload.new as Message;
              setMessages((prev) => {
                // Prevent duplicate messages
                const exists = prev.some((msg) => msg.id === newMessage.id);
                if (exists) return prev;
                return [...prev, newMessage];
              });

              // Auto-mark admin messages as read and show notification
              if (newMessage.message_type === "admin" && user) {
                await markMessagesAsRead(conversation.id, user, userRole);

                // Show notification if chat is closed
                if (!isOpen) {
                  toast.info("New message from support team", {
                    duration: 4000,
                    action: {
                      label: "View",
                      onClick: () => setIsOpen(true),
                    },
                  });
                }
              }
            }

            if (payload.eventType === "UPDATE") {
              const updatedMessage = payload.new as Message;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === updatedMessage.id ? updatedMessage : msg
                )
              );
            }
          } catch (error) {
            console.error("Error handling message update:", error);
          }
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          toast.error(
            "Message sync error. Some messages may not appear in real-time."
          );
        }
      });
  }, [conversation, user, userRole, isOpen]);

  // Send message function with enhanced error handling
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !conversation || !user || isSending) return;

    const messageContent = newMessage.trim();
    setNewMessage(""); // Clear input immediately for better UX
    setIsSending(true);

    try {
      const result = await sendMessage(
        conversation.id,
        messageContent,
        "user",
        user,
        userRole
      );

      if (result.error) {
        // Restore message on error
        setNewMessage(messageContent);
        toast.error(result.error);
        return;
      }

      // Show different messages based on admin availability
      if (!adminPresenceState.isOnline) {
        toast.info(
          `Message sent! Expected response time: ${adminPresenceState.averageResponseTime}`,
          {
            duration: 4000,
          }
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setNewMessage(messageContent); // Restore message
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  }, [newMessage, conversation, user, userRole, isSending, adminPresenceState]);

  // Setup real-time subscriptions with proper cleanup
  useEffect(() => {
    if (!user) return;

    // Always setup presence tracking when user is available
    setupPresenceTracking();

    // Setup message subscription only when conversation exists
    if (conversation) {
      setupMessageSubscription();
    }

    return () => {
      // Cleanup function
      setUserOnlineStatus(false);
      setConnectionStatus("disconnected");

      if (presenceChannelRef.current) {
        presenceChannelRef.current.untrack();
        supabase.removeChannel(presenceChannelRef.current);
        presenceChannelRef.current = null;
      }

      if (messageChannelRef.current) {
        supabase.removeChannel(messageChannelRef.current);
        messageChannelRef.current = null;
      }
    };
  }, [user, conversation, setupMessageSubscription, setupPresenceTracking]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Open chat handler with enhanced initialization
  const openChat = useCallback(async () => {
    setIsOpen(true);
    if (!conversation) {
      await initializeConversation();
    }
  }, [conversation, initializeConversation]);

  // Close chat handler with cleanup
  const closeChat = useCallback(() => {
    setIsOpen(false);
    // Keep connections alive for notifications
  }, []);

  // Get admin status summary for UI
  const getAdminStatusSummary = useCallback(() => {
    const { isOnline, onlineAdmins, averageResponseTime } = adminPresenceState;

    if (isOnline) {
      return {
        status: "online" as const,
        message: `${onlineAdmins.length} support agent${
          onlineAdmins.length > 1 ? "s" : ""
        } online`,
        responseTime: "< 5 min",
        color: "green",
      };
    }

    return {
      status: "offline" as const,
      message: "Support team offline",
      responseTime: averageResponseTime || "2-4 hours",
      color: "gray",
    };
  }, [adminPresenceState]);

  return {
    // Basic chat functionality
    isOpen,
    setIsOpen,
    conversation,
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    isSending,
    messagesEndRef,
    handleSendMessage,
    openChat,
    closeChat,

    // Enhanced admin status tracking
    adminPresenceState,
    isAdminOnline: adminPresenceState.isOnline,
    getAdminStatusSummary,

    // Connection status
    userOnlineStatus,
    connectionStatus,

    // Utility functions
    initializeConversation,
  };
};
