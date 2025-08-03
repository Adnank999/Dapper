"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  MessageSquare,
  User,
  Clock,
  Loader2,
  CheckCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  getAllConversationsAction,
  getConversationMessagesAction,
  sendAdminReplyAction,
  markAdminMessagesAsReadAction,
  type ConversationWithUser,
  type AdminMessage,
} from "../../../utils/supabase/chats/admin-chat";
import { useUser } from "@/app/context/UserContext";
import { Message } from "@/utils/supabase/chats/chat";
import { useAdminListen } from "@/hooks/useAdminListen";
import { getAllUsersInitiatedConversations } from "@/lib/getAllUsers";
import { useUserPresence } from "@/hooks/useUserPresence";

// Add these utility functions
const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const formatDuration = (milliseconds: number) => {
  const minutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(milliseconds / 3600000);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
};

export default function AdminChatInterface() {
  const [conversations, setConversations] = useState<ConversationWithUser[]>(
    []
  );
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationWithUser | null>(null);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const [error, setError] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { user, userRole } = useUser();

  // 🔄 Handle real-time message changes with toast notifications
  const handleMessageChange = useCallback(
    (payload: any) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      // console.log("Processing message change:", eventType, payload);

      switch (eventType) {
        case "INSERT":
          // New message received
          const newMessage = newRecord;

          // Show toast notification for new messages
          if (newMessage.message_type === "user") {
            // New message from user
            const conversationName =
              conversations.find(
                (conv) => conv.id === newMessage.conversation_id
              )?.user?.full_name ||
              conversations.find(
                (conv) => conv.id === newMessage.conversation_id
              )?.user?.email ||
              "Unknown User";

            toast.success(`📩 New message from ${conversationName}`, {
              description:
                newMessage.content.length > 50
                  ? `${newMessage.content.substring(0, 50)}...`
                  : newMessage.content,
              duration: 4000,
            });
          } else if (newMessage.message_type === "admin") {
            // Admin reply sent (could be from another admin)
            toast.info("✅ Admin reply sent", {
              description: "Message delivered successfully",
              duration: 3000,
            });
          }

          // If it's for the currently selected conversation, add to messages
          if (
            selectedConversation &&
            newMessage.conversation_id === selectedConversation.id
          ) {
            setMessages((prev) => {
              // Check if message already exists to prevent duplicates
              const exists = prev.some((msg) => msg.id === newMessage.id);
              if (exists) return prev;

              // Add new message and sort by created_at
              return [...prev, newMessage].sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
              );
            });
          }

          // Update conversations list (for last message and unread count)
          setConversations((prev) =>
            prev
              .map((conv) => {
                if (conv.id === newMessage.conversation_id) {
                  return {
                    ...conv,
                    last_message: {
                      content: newMessage.content,
                      created_at: newMessage.created_at,
                      message_type: newMessage.message_type,
                    },
                    updated_at: newMessage.created_at,
                    // Increment unread count only for user messages
                    unread_count:
                      newMessage.message_type === "user"
                        ? (conv.unread_count || 0) + 1
                        : conv.unread_count || 0,
                  };
                }
                return conv;
              })
              .sort(
                (a, b) =>
                  // Sort by updated_at descending (latest first)
                  new Date(b.updated_at || b.created_at).getTime() -
                  new Date(a.updated_at || a.created_at).getTime()
              )
          );
          break;

        case "UPDATE":
          // Message updated (e.g., read status changed)
          const updatedMessage = newRecord;

          // Show toast for message read status changes
          if (
            oldRecord.is_read === false &&
            updatedMessage.is_read === true &&
            updatedMessage.message_type === "admin"
          ) {
            toast.success("👁️ Message read by user", {
              description: "Your message has been seen",
              duration: 3000,
            });
          }

          // Update message in current conversation if it's displayed
          if (
            selectedConversation &&
            updatedMessage.conversation_id === selectedConversation.id
          ) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id
                  ? { ...msg, ...updatedMessage }
                  : msg
              )
            );
          }

          // If message was marked as read, update unread count
          if (
            oldRecord.is_read === false &&
            updatedMessage.is_read === true &&
            updatedMessage.message_type === "user"
          ) {
            setConversations((prev) =>
              prev.map((conv) =>
                conv.id === updatedMessage.conversation_id
                  ? {
                      ...conv,
                      unread_count: Math.max(0, (conv.unread_count || 1) - 1),
                    }
                  : conv
              )
            );
          }
          break;

        case "DELETE":
          // Message deleted
          const deletedMessage = oldRecord;

          // Show toast for deleted messages
          toast.warning("🗑️ Message deleted", {
            description: "A message has been removed from the conversation",
            duration: 3000,
          });

          // Remove from current messages if displayed
          if (
            selectedConversation &&
            deletedMessage.conversation_id === selectedConversation.id
          ) {
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== deletedMessage.id)
            );
          }

          // Update unread count if deleted message was unread user message
          if (
            deletedMessage.is_read === false &&
            deletedMessage.message_type === "user"
          ) {
            setConversations((prev) =>
              prev.map((conv) =>
                conv.id === deletedMessage.conversation_id
                  ? {
                      ...conv,
                      unread_count: Math.max(0, (conv.unread_count || 1) - 1),
                    }
                  : conv
              )
            );
          }
          break;
      }
    },
    [selectedConversation, conversations]
  );

  // 🔄 Handle real-time conversation changes with toast notifications
  const handleConversationChange = useCallback(
    (payload: any) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      // console.log("Processing conversation change:", eventType, payload);

      switch (eventType) {
        case "INSERT":
          // New conversation created
          const newConversation = newRecord;

          // Show toast for new conversation
          toast.success("💬 New conversation started", {
            description: `New chat with ${
              newConversation.user?.full_name ||
              newConversation.user?.email ||
              "a user"
            }`,
            duration: 4000,
          });

          // Add new conversation to the list (it will be sorted by updated_at)
          setConversations((prev) => {
            const exists = prev.some((conv) => conv.id === newConversation.id);
            if (exists) return prev;

            // Add new conversation and sort by updated_at
            return [newConversation, ...prev].sort(
              (a, b) =>
                new Date(b.updated_at || b.created_at).getTime() -
                new Date(a.updated_at || a.created_at).getTime()
            );
          });
          break;

        case "UPDATE":
          // Conversation updated (e.g., updated_at changed)
          const updatedConversation = newRecord;

          // Show toast for conversation updates (optional - might be too frequent)
          // Uncomment if you want notifications for every conversation update
          /*
        toast.info("🔄 Conversation updated", {
          description: "Conversation details have been updated",
          duration: 2000,
        });
        */

          setConversations((prev) =>
            prev
              .map((conv) =>
                conv.id === updatedConversation.id
                  ? { ...conv, ...updatedConversation }
                  : conv
              )
              .sort(
                (a, b) =>
                  // Re-sort after update to maintain latest-first order
                  new Date(b.updated_at || b.created_at).getTime() -
                  new Date(a.updated_at || a.created_at).getTime()
              )
          );

          // Update selected conversation if it's the one being updated
          if (
            selectedConversation &&
            selectedConversation.id === updatedConversation.id
          ) {
            setSelectedConversation((prev) =>
              prev ? { ...prev, ...updatedConversation } : prev
            );
          }
          break;

        case "DELETE":
          // Conversation deleted
          const deletedConversation = oldRecord;

          // Show toast for deleted conversation
          toast.error("❌ Conversation deleted", {
            description: `Chat with ${
              deletedConversation.user?.full_name ||
              deletedConversation.user?.email ||
              "user"
            } has been removed`,
            duration: 4000,
          });

          setConversations((prev) =>
            prev.filter((conv) => conv.id !== deletedConversation.id)
          );

          // Clear selected conversation if it was deleted
          if (
            selectedConversation &&
            selectedConversation.id === deletedConversation.id
          ) {
            setSelectedConversation(null);
            setMessages([]);
          }
          break;
      }
    },
    [selectedConversation, conversations]
  );

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { users: fetchedUsers, error } =
        await getAllUsersInitiatedConversations();

      if (error) {
        setError(error.message || "Failed to fetch users");
      } else {
        setUsers(fetchedUsers);
        setError(null);
      }
    } catch (err) {
      setError("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // console.log("users", users);
  // console.log("isConnected", isConnected);

  // 🔄 Use the hook with both callbacks
  const {
    isConnected,
    onlineUsers,
    offlineUsers,
    totalSubscribedUsers,
    onlineCount,
    reconnect,
  } = useAdminListen({
    user,
    userRole,
    users: users || [],

    onMessageChange: handleMessageChange,
    onConversationChange: handleConversationChange,
    onUserPresenceChange: (online, offline) => {
      // console.log(`Users online: ${online.length}, offline: ${offline.length}`);
      // Handle user presence changes
    },
  });

  // console.log("online ", onlineUsers);
  // console.log("offline", offlineUsers);
  // console.log(" totalSubscribedUsers", totalSubscribedUsers);

  const { allUsers, onlineUsersCount, updatePresence } = useUserPresence({
    user,
    userRole,
    isAdmin: true,
    enabled: true,
    observerMode: true, // NEW: Enable observer mode for admin
  });

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const loadConversations = async () => {
    setLoadingConversations(true);
    try {
      const result = await getAllConversationsAction(user, userRole);
      // console.log("result", result);
      if (result.error) {
        toast.error(result.error);
      } else {
        // Sort conversations by updated_at descending (latest first)
        const sortedConversations = (result.data || []).sort(
          (a, b) =>
            new Date(b.updated_at || b.created_at).getTime() -
            new Date(a.updated_at || a.created_at).getTime()
        );
        setConversations(sortedConversations);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoadingConversations(false);
    }
  };

  // ... rest of your methods remain the same

  const loadMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const result = await getConversationMessagesAction(
        conversationId,
        user,
        userRole
      );
      if (result.error) {
        toast.error(result.error);
      } else {
        setMessages(result.data || []);
        // Mark messages as read
        await markAdminMessagesAsReadAction(conversationId, user, userRole);
        // Don't refresh conversations - real-time will handle updates
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleConversationSelect = (conversation: ConversationWithUser) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  const handleSendReply = async () => {
    if (!inputValue.trim() || !selectedConversation || loading) return;

    const messageContent = inputValue.trim();
    setInputValue("");
    setLoading(true);

    try {
      const result = await sendAdminReplyAction(
        selectedConversation.id,
        messageContent,
        user,
        userRole
      );

      if (result.error) {
        toast.error(result.error);
        setInputValue(messageContent);
      } else {
        // Real-time will handle all updates
        toast.success("Reply sent!");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
      setInputValue(messageContent);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your helper methods remain the same

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderReadConfirmation = (message: Message) => {
    if (message.message_type !== "admin") {
      return null;
    }

    const hasUserReadConfirmation = message.is_read === true;

    if (hasUserReadConfirmation) {
      return (
        <div className="flex items-center justify-end mt-1">
          <CheckCheck className="h-3 w-3 text-blue-400" />
          <span className="text-xs text-blue-400 ml-1">Read</span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-end mt-1">
        <Check className="h-3 w-3 text-gray-400" />
        <span className="text-xs text-gray-400 ml-1">Sent</span>
      </div>
    );
  };

  const ConnectionStatus = () => (
    <div
      className={`flex items-center gap-2 text-xs ${
        isConnected ? "text-green-400" : "text-red-400"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? "bg-green-400" : "bg-red-400"
        }`}
      />
      {isConnected ? "Live" : "Offline"}
    </div>
  );
  // Rest of your JSX remains the same, just add ConnectionStatus somewhere in your header
  return (
    // <div className="flex h-[1000px] bg-transparent rounded-lg shadow-lg overflow-hidden mb-52">
    //   {/* Conversations List */}
    //   <div className="w-1/3 border-r border-gray-200">
    //     <div className="p-4 border-b border-gray-200">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <h2 className="text-lg font-semibold text-white">
    //             Chat Conversations
    //           </h2>
    //           <p className="text-sm text-white">
    //             Manage customer support chats
    //           </p>
    //         </div>
    //         <ConnectionStatus />
    //         Online Users: {onlineUsersCount}
    //       </div>
    //     </div>

    //     {/* Rest of your conversations list JSX remains the same */}
    //     <ScrollArea className="h-[calc(600px-80px)]">
    //       {loadingConversations ? (
    //         <div className="flex items-center justify-center h-32">
    //           <Loader2 className="h-6 w-6 animate-spin text-white" />
    //         </div>
    //       ) : conversations.length === 0 ? (
    //         <div className="p-4 text-center text-white">
    //           <MessageSquare className="h-8 w-8 mx-auto mb-2 text-white" />
    //           <p>No conversations yet</p>
    //         </div>
    //       ) : (
    //         <div className="space-y-1">
    //           {conversations.map((conversation) => {
    //             // Check if this user is online
    //             const userPresence = onlineUsers.find(
    //               (user) => user.userId === conversation.user_id
    //             );
    //             const isUserOnline = !!userPresence;

    //             return (
    //               <div
    //                 key={conversation.id}
    //                 onClick={() => handleConversationSelect(conversation)}
    //                 className={`p-4 cursor-pointer hover:bg-slate-800 transition-colors ${
    //                   selectedConversation?.id === conversation.id
    //                     ? "bg-slate-800 border-r-2 border-blue-500"
    //                     : ""
    //                 }`}
    //               >
    //                 <div className="flex items-start space-x-3">
    //                   <div className="flex-1 min-w-0">
    //                     <div className="flex items-center justify-between">
    //                       <div className="flex items-center gap-2">
    //                         <p className="text-sm font-medium text-white truncate">
    //                           {conversation.user?.full_name ||
    //                             conversation.user?.email}
    //                         </p>
    //                         {/* Online/Offline Status Indicator */}
    //                         <div
    //                           className={`w-2 h-2 rounded-full flex-shrink-0 ${
    //                             isUserOnline ? "bg-green-400" : "bg-red-400"
    //                           }`}
    //                           title={isUserOnline ? "Online" : "Offline"}
    //                         />
    //                       </div>
    //                       {conversation.unread_count &&
    //                         conversation.unread_count > 0 && (
    //                           <Badge variant="destructive" className="text-xs">
    //                             {conversation.unread_count}
    //                           </Badge>
    //                         )}
    //                     </div>

    //                     <div className="flex items-center gap-2">
    //                       <p className="text-xs text-white truncate">
    //                         {conversation.user?.email}
    //                       </p>
    //                       {/* Optional: Show status text */}
    //                       {isUserOnline && (
    //                         <span className="text-xs text-green-400">
    //                           • Online
    //                         </span>
    //                       )}
    //                     </div>

    //                     {conversation.last_message && (
    //                       <>
    //                         <p className="text-sm text-white truncate mt-1">
    //                           {conversation.last_message.content}
    //                         </p>
    //                         <div className="flex items-center mt-1 text-xs text-white">
    //                           <Clock className="h-3 w-3 mr-1" />
    //                           {formatLastMessageTime(
    //                             conversation.last_message.created_at
    //                           )}
    //                         </div>
    //                       </>
    //                     )}
    //                   </div>
    //                 </div>
    //               </div>
    //             );
    //           })}
    //         </div>
    //       )}
    //     </ScrollArea>
    //   </div>

    //   {/* Messages Area */}
    //   <div className="flex-1 flex flex-col">
    //     {selectedConversation ? (
    //       <>
    //         {/* Chat Header */}
    //         <div className="p-4 border-b border-gray-200 bg-transparent">
    //           <div className="flex items-center space-x-3">
    //             <Avatar className="h-8 w-8">
    //               <AvatarImage
    //                 src={selectedConversation.user?.avatar_url || undefined}
    //               />
    //               <AvatarFallback>
    //                 <User className="h-4 w-4" />
    //               </AvatarFallback>
    //             </Avatar>
    //             <div>
    //               <h3 className="text-sm font-medium text-gray-900">
    //                 {selectedConversation.user?.full_name ||
    //                   selectedConversation.user?.email}
    //               </h3>
    //               <p className="text-xs text-gray-500">
    //                 {selectedConversation.user?.email}
    //               </p>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Messages */}
    //         <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
    //           {loadingMessages ? (
    //             <div className="flex items-center justify-center h-32">
    //               <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    //             </div>
    //           ) : (
    //             <div className="space-y-4">
    //               {messages.map((message) => (
    //                 <div
    //                   key={message.id}
    //                   className={`flex ${
    //                     message.message_type === "admin"
    //                       ? "justify-end"
    //                       : "justify-start"
    //                   }`}
    //                 >
    //                   <div
    //                     className={`max-w-xs px-3 py-2 rounded-lg ${
    //                       message.message_type === "admin"
    //                         ? "bg-blue-600 text-white"
    //                         : "bg-gray-100 text-gray-900"
    //                     }`}
    //                   >
    //                     <p className="text-sm">{message.content}</p>
    //                     <p className="text-xs opacity-70 mt-1">
    //                       {formatMessageTime(message.created_at)}
    //                     </p>
    //                   </div>

    //                   {/* Read confirmation for admin messages by user */}
    //                   {renderReadConfirmation(message)}
    //                 </div>
    //               ))}
    //             </div>
    //           )}
    //         </ScrollArea>

    //         {/* Reply Input */}
    //         <div className="p-4 border-t border-gray-200">
    //           <div className="flex space-x-2">
    //             <Input
    //               value={inputValue}
    //               onChange={(e) => setInputValue(e.target.value)}
    //               onKeyPress={handleKeyPress}
    //               placeholder="Type your reply..."
    //               className="flex-1"
    //               disabled={loading}
    //             />
    //             <Button
    //               onClick={handleSendReply}
    //               size="icon"
    //               disabled={loading || !inputValue.trim()}
    //             >
    //               {loading ? (
    //                 <Loader2 className="h-4 w-4 animate-spin" />
    //               ) : (
    //                 <Send className="h-4 w-4" />
    //               )}
    //             </Button>
    //           </div>
    //         </div>
    //       </>
    //     ) : (
    //       <div className="flex-1 flex items-center justify-center text-gray-500">
    //         <div className="text-center">
    //           <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
    //           <p>Select a conversation to start chatting</p>
    //         </div>
    //       </div>
    //     )}
    //   </div>

    //      {Object.entries(allUsers).map(([userId, userData]) => (
    //         <div key={userId} className="user-card">
    //           <div className="user-info">
    //             <img
    //               src={userData.avatar_url || "/default-avatar.png"}
    //               alt={userData.full_name}
    //               className="avatar"
    //             />
    //             <div>
    //               <h4>{userData.full_name}</h4>

    //             </div>
    //           </div>

    //           <div className="activity-info">
    //             <div className={`status ${userData.status}`}>
    //               {userData.status}
    //             </div>

    //             {userData.isTyping && (
    //               <div className="typing-indicator">✏️ Typing...</div>
    //             )}

    //             <div className="last-activity">
    //               Last active:{" "}
    //               {new Date(userData.lastActivity).toLocaleTimeString()}
    //             </div>

    //             <div className="joined-at">
    //               Joined: {new Date(userData.joinedAt).toLocaleTimeString()}
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    // </div>

    <div className="flex h-[1000px] bg-transparent rounded-lg shadow-lg overflow-hidden mb-52">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Chat Conversations
              </h2>
              <p className="text-sm text-white">
                Manage customer support chats
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ConnectionStatus />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-white">
                  {onlineUsersCount} online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Conversations List with Real-time Activity */}
        <ScrollArea className="h-[calc(600px-80px)]">
          {loadingConversations ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-white">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-white" />
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => {
                // Enhanced user presence check
                const userPresence = Object.values(allUsers).find(
                  (user) => user.userId === conversation.user_id
                );
                const isUserOnline = !!userPresence;
                const isTyping = userPresence?.isTyping || false;
                const lastActivity = userPresence?.lastActivity;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationSelect(conversation)}
                    className={`p-4 cursor-pointer hover:bg-slate-800 transition-colors relative ${
                      selectedConversation?.id === conversation.id
                        ? "bg-slate-800 border-r-2 border-blue-500"
                        : ""
                    }`}
                  >
                    {/* Typing indicator overlay */}
                    {isTyping && (
                      <div className="absolute top-2 right-2">
                        <div className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                          <div className="flex gap-1">
                            <div
                              className="w-1 h-1 bg-white rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-1 h-1 bg-white rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="w-1 h-1 bg-white rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                          <span className="ml-1">typing</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-3">
                      {/* Enhanced Avatar with Status */}
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              conversation.user?.avatar_url ||
                              userPresence?.avatar_url
                            }
                          />
                          <AvatarFallback className="bg-gray-600 text-white">
                            {(
                              conversation.user?.full_name ||
                              conversation.user?.email
                            )
                              ?.charAt(0)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {/* Status indicator */}
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                            isUserOnline
                              ? userPresence?.status === "active"
                                ? "bg-green-400"
                                : userPresence?.status === "away"
                                ? "bg-yellow-400"
                                : "bg-red-400"
                              : "bg-gray-400"
                          }`}
                          title={
                            isUserOnline
                              ? `${
                                  userPresence?.status
                                } - Last active: ${new Date(
                                  lastActivity || 0
                                ).toLocaleTimeString()}`
                              : "Offline"
                          }
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white truncate">
                              {conversation.user?.full_name ||
                                conversation.user?.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {conversation.unread_count &&
                              conversation.unread_count > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  {conversation.unread_count}
                                </Badge>
                              )}
                          </div>
                        </div>

                        {/* Enhanced status line */}
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-300 truncate">
                            {conversation.user?.email}
                          </p>
                          {isUserOnline && (
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-xs ${
                                  userPresence?.status === "active"
                                    ? "text-green-400"
                                    : userPresence?.status === "away"
                                    ? "text-yellow-400"
                                    : "text-red-400"
                                }`}
                              >
                                • {userPresence?.status}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Activity indicator */}
                        {isUserOnline && lastActivity && (
                          <div className="text-xs text-gray-400 mt-1">
                            Active {formatTimeAgo(lastActivity)}
                          </div>
                        )}

                        {conversation.last_message && (
                          <>
                            <p className="text-sm text-white truncate mt-1">
                              {conversation.last_message.content}
                            </p>
                            <div className="flex items-center mt-1 text-xs text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatLastMessageTime(
                                conversation.last_message.created_at
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Enhanced Chat Header with Real-time Status */}
            <div className="p-4 border-b border-gray-200 bg-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          selectedConversation.user?.avatar_url ||
                          Object.values(allUsers).find(
                            (u) => u.userId === selectedConversation.user_id
                          )?.avatar_url
                        }
                      />
                      <AvatarFallback className="bg-gray-600 text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    {/* Status indicator */}
                    {(() => {
                      const userPresence = Object.values(allUsers).find(
                        (u) => u.userId === selectedConversation.user_id
                      );
                      const isOnline = !!userPresence;
                      return (
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            isOnline
                              ? userPresence?.status === "active"
                                ? "bg-green-400"
                                : userPresence?.status === "away"
                                ? "bg-yellow-400"
                                : "bg-red-400"
                              : "bg-gray-400"
                          }`}
                        />
                      );
                    })()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {selectedConversation.user?.full_name ||
                          selectedConversation.user?.email}
                      </h3>
                      {(() => {
                        const userPresence = Object.values(allUsers).find(
                          (u) => u.userId === selectedConversation.user_id
                        );
                        return (
                          userPresence?.isTyping && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <div className="flex gap-1">
                                <div
                                  className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
                                  style={{ animationDelay: "0ms" }}
                                />
                                <div
                                  className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
                                  style={{ animationDelay: "150ms" }}
                                />
                                <div
                                  className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
                                  style={{ animationDelay: "300ms" }}
                                />
                              </div>
                              <span className="text-xs">typing...</span>
                            </div>
                          )
                        );
                      })()}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500">
                        {selectedConversation.user?.email}
                      </p>
                      {(() => {
                        const userPresence = Object.values(allUsers).find(
                          (u) => u.userId === selectedConversation.user_id
                        );
                        return (
                          userPresence && (
                            <span
                              className={`text-xs ${
                                userPresence.status === "active"
                                  ? "text-green-600"
                                  : userPresence.status === "away"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              • {userPresence.status} • Last seen{" "}
                              {formatTimeAgo(userPresence.lastActivity)}
                            </span>
                          )
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  {(() => {
                    const userPresence = Object.values(allUsers).find(
                      (u) => u.userId === selectedConversation.user_id
                    );
                    return (
                      userPresence && (
                        <div className="text-xs text-gray-500 text-right">
                          <div>
                            Online for{" "}
                            {formatDuration(Date.now() - userPresence.joinedAt)}
                          </div>
                          {userPresence.conversationId && (
                            <div>
                              In conversation:{" "}
                              {userPresence.conversationId.slice(-8)}
                            </div>
                          )}
                        </div>
                      )
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Messages - Same as before */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              {loadingMessages ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.message_type === "admin"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.message_type === "admin"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatMessageTime(message.created_at)}
                        </p>
                      </div>
                      {renderReadConfirmation(message)}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Reply Input - Same as before */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your reply..."
                  className="flex-1"
                  disabled={loading}
                />
                <Button
                  onClick={handleSendReply}
                  size="icon"
                  disabled={loading || !inputValue.trim()}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a conversation to start chatting</p>
              {onlineUsersCount > 0 && (
                <p className="text-sm mt-2">
                  {onlineUsersCount} user{onlineUsersCount !== 1 ? "s" : ""}{" "}
                  currently online
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Optional: Live Activity Sidebar (can be toggled) */}
      {Object.keys(allUsers).length > 0 && (
        <div className="w-80 border-l border-gray-200 bg-slate-900/50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-white">Live Activity</h3>
            <p className="text-sm text-gray-300">
              {Object.keys(allUsers).length} users online
            </p>
          </div>
          <ScrollArea className="h-[calc(1000px-80px)]">
            <div className="p-4 space-y-3">
              {Object.entries(allUsers).map(([userId, userData]) => (
                <div
                  key={userId}
                  className="bg-slate-800 rounded-lg p-3 border border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userData.avatar_url} />
                        <AvatarFallback className="bg-gray-600 text-white text-xs">
                          {userData.full_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-slate-800 ${
                          userData.status === "active"
                            ? "bg-green-400"
                            : userData.status === "away"
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {userData.full_name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {userData.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          userData.status === "active"
                            ? "bg-green-400/20 text-green-400"
                            : userData.status === "away"
                            ? "bg-yellow-400/20 text-yellow-400"
                            : "bg-red-400/20 text-red-400"
                        }`}
                      >
                        {userData.status}
                      </span>
                      {userData.isTyping && (
                        <span className="text-xs text-blue-400 flex items-center gap-1">
                          ✏️ Typing...
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-400">
                      Active: {formatTimeAgo(userData.lastActivity)}
                    </div>

                    <div className="text-xs text-gray-500">
                      Joined: {formatTimeAgo(userData.joinedAt)}
                    </div>

                    {userData.conversationId && (
                      <div className="text-xs text-blue-400">
                        In chat: {userData.conversationId.slice(-8)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
