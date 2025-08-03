// "use client";

// import type React from "react";
// import { useState, useEffect, useRef } from "react";
// import {
//   MessageCircle,
//   X,
//   Send,
//   Loader2,
//   Check,
//   CheckCheck,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { toast } from "sonner";
// import {
//   getOrCreateConversation,
//   getMessages,
//   sendMessage,
//   markMessagesAsRead,
//   type Message,
//   type Conversation,
// } from "../../utils/supabase/chats/chat";
// import { useUser } from "../context/UserContext";
// import { useOnlineCheck } from "@/hooks/useOnlineCheck";
// import { useUserPresence } from "@/hooks/useUserPresence";

// export default function ChatBubble() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputValue, setInputValue] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [initializing, setInitializing] = useState(false);
//   const [conversation, setConversation] = useState<Conversation | null>(null);
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
//     const [isTyping, setIsTyping] = useState(false);
//   const [lastActivity, setLastActivity] = useState(Date.now());


//   const scrollAreaRef = useRef<HTMLDivElement>(null);

//   const { user, userRole, error } = useUser();
//   console.log("user", user);
//  // Add the presence hook - it will automatically handle joining/leaving
//    const { updatePresence } = useUserPresence({ 
//     user, 
//     enabled: isOpen && !!conversation,
//     conversationId: conversation?.id,
//     isTyping,
//     lastActivity
//   });

 
//   // Initialize chat when opened
//   useEffect(() => {
//     if (isOpen && !conversation) {
//       initializeChat();
//     }
//   }, [isOpen]);

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     if (scrollAreaRef.current) {
//       scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
//     }
//   }, [messages]);

//    const handleUserActivity = () => {
//     setLastActivity(Date.now());
//     updatePresence({ lastActivity: Date.now(), status: 'active' });
//   };

//     // Handle typing status
//   const handleTypingStart = () => {
//     setIsTyping(true);
//     updatePresence({ isTyping: true });
//   };

//   const handleTypingStop = () => {
//     setIsTyping(false);
//     updatePresence({ isTyping: false });
//   };

//   const initializeChat = async () => {
//     setInitializing(true);
//     try {
//       // Get or create conversation
//       const convResult = await getOrCreateConversation(user);
//       console.log("conversation Result", convResult);
//       if (convResult.error) {
//         toast.error(convResult.error);
//         return;
//       }

//       setConversation(convResult.data);
//       setCurrentUserId(convResult.data.user_id);

//       // Load existing messages
//       const messagesResult = await getMessages(convResult.data.id);
//       if (messagesResult.error) {
//         toast.error(messagesResult.error);
//         return;
//       }

//       setMessages(messagesResult.data || []);

//       // Mark messages as read
//       await markMessagesAsRead(convResult.data.id, user, userRole);
//     } catch (error) {
//       console.error("Error initializing chat:", error);
//       toast.error("Failed to initialize chat");
//     } finally {
//       setInitializing(false);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || !conversation || loading) return;

//     const messageContent = inputValue.trim();
//     setInputValue("");
//     setLoading(true);

//     const messageType = "user";
//     try {
//       const result = await sendMessage(
//         conversation.id,
//         messageContent,
//         messageType,
//         user,
//         userRole
//       );

//       if (result.error) {
//         toast.error(result.error);
//         // Restore input value on error
//         setInputValue(messageContent);
//       } else {
//         // Add the new message to the list
//         setMessages((prev) => [...prev, result.data]);
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//       toast.error("Failed to send message");
//       setInputValue(messageContent);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const formatMessageTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const isUserMessage = (message: Message) => {
//     return message.sender_id === currentUserId;
//   };

//   // Function to render read confirmation for admin messages
//   const renderReadConfirmation = (message: Message) => {
//     // Only show read confirmation for USER messages
//     if (message.message_type !== "user") {
//       return null; // Don't show any read status for admin messages
//     }

//     // Check if THIS specific user message is read by admin
//     const hasAdminReadConfirmation = message.is_read === true;

//     if (hasAdminReadConfirmation) {
//       return (
//         <div className="flex items-center justify-end mt-1">
//           <CheckCheck className="h-3 w-3 text-blue-400" />
//           <span className="text-xs text-blue-400 ml-1">Read</span>
//         </div>
//       );
//     }

//     // Show single check for sent but not read (only for user messages)
//     return (
//       <div className="flex items-center justify-end mt-1">
//         <Check className="h-3 w-3 text-gray-400" />
//         <span className="text-xs text-gray-400 ml-1">Sent</span>
//       </div>
//     );
//   };

//   return (
//     <>
//       {/* Chat Bubble */}
//       <div className="fixed bottom-6 right-6 z-50">
//         <Button
//           onClick={() => setIsOpen(!isOpen)}
//           className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
//           size="icon"
//         >
//           {isOpen ? (
//             <X className="h-6 w-6 text-white" />
//           ) : (
//             <MessageCircle className="h-6 w-6 text-white" />
//           )}
//         </Button>
//       </div>

//       {/* Glassmorphism Chat Window */}
//       {isOpen && (
//         <div className="fixed bottom-24 right-6 z-40 w-80 h-96 rounded-2xl backdrop-blur-md bg-white/10 border border-white/30 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
//           {/* Chat Header */}
//           <div className="flex items-center justify-between p-4 border-b border-white/20">
//             <div className="flex items-center space-x-2">
//               <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//               <h3 className="font-semibold text-white">Chat Support</h3>
//             </div>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsOpen(false)}
//               className="h-8 w-8 text-gray-600 hover:text-gray-800"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>

//           {/* Messages Area */}
//           <ScrollArea className="h-82 p-4" ref={scrollAreaRef}>
//             {initializing ? (
//               <div className="flex items-center justify-center h-full">
//                 <Loader2 className="h-6 w-6 animate-spin text-white" />
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {messages.length === 0 ? (
//                   <div className="text-center text-white/70 text-sm">
//                     Welcome! How can we help you today?
//                   </div>
//                 ) : (
//                   messages.map((message) => (
//                     <div
//                       key={message.id}
//                       className={`flex ${
//                         isUserMessage(message) ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       <div
//                         className={`max-w-xs px-3 py-2 rounded-2xl ${
//                           isUserMessage(message)
//                             ? "bg-blue-600 text-white"
//                             : "bg-white/40 backdrop-blur-sm text-gray-800 border border-white/30"
//                         }`}
//                       >
//                         <p className="text-sm">{message.content}</p>
//                         <p className="text-xs opacity-70 mt-1">
//                           {formatMessageTime(message.created_at)}
//                         </p>
//                       </div>

//                       {/* Read confirmation for user messages by admin */}
//                       {renderReadConfirmation(message)}
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </ScrollArea>

//           {/* Input Area */}
//           <div className="p-4 border-t border-white/20">
//             <div className="flex space-x-2">
//               <Input
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Type your message..."
//                 className="flex-1 bg-white/40 backdrop-blur-sm border-white/30 placeholder:text-gray-600 text-gray-800"
//                 disabled={loading || initializing || !conversation}
//               />
//               <Button
//                 onClick={handleSendMessage}
//                 size="icon"
//                 className="bg-blue-600 hover:bg-blue-700 text-white"
//                 disabled={
//                   loading || initializing || !conversation || !inputValue.trim()
//                 }
//               >
//                 {loading ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Send className="h-4 w-4" />
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Backdrop overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-30"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </>
//   );
// }


"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Check,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  type Message,
  type Conversation,
} from "../../utils/supabase/chats/chat";
import { useUser } from "../context/UserContext";
import { useUserPresence } from "@/hooks/useUserPresence";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Typing timeout refs
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { user, userRole} = useUser();

  // Add the presence hook - it will automatically handle joining/leaving
  const { updatePresence } = useUserPresence({ 
    user, 
    enabled: isOpen && !!conversation,
    conversationId: conversation?.id,
    isTyping,
    lastActivity
  });

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && !conversation) {
      initializeChat();
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Track user activity and update presence
  const handleUserActivity = useCallback(() => {
    const now = Date.now();
    setLastActivity(now);
    
    // Update presence with active status
    updatePresence({ 
      lastActivity: now, 
      status: 'active' 
    });

    // Clear existing activity timeout
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    // Set user as away after 5 minutes of inactivity
    activityTimeoutRef.current = setTimeout(() => {
      updatePresence({ 
        status: 'away',
        lastActivity: Date.now()
      });
    }, 5 * 60 * 1000); // 5 minutes

  }, [updatePresence]);

  // Handle typing status with debouncing
  const handleTypingStart = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      updatePresence({ isTyping: true });
    }

    // Clear existing typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 3000);

    // Also track as user activity
    handleUserActivity();
  }, [isTyping, updatePresence, handleUserActivity]);

  const handleTypingStop = useCallback(() => {
    if (isTyping) {
      setIsTyping(false);
      updatePresence({ isTyping: false });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [isTyping, updatePresence]);

  // Track various user activities
  const trackActivity = useCallback((activityType?: string) => {
    console.log(`[ChatBubble] User activity: ${activityType || 'general'}`);
    handleUserActivity();
  }, [handleUserActivity]);

  // Enhanced input change handler with typing detection
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Track typing if user is actually typing (not just deleting)
    if (value.length > 0) {
      handleTypingStart();
    } else {
      // If input is empty, stop typing
      handleTypingStop();
    }

    // Track as general activity
    trackActivity('typing');
  }, [handleTypingStart, handleTypingStop, trackActivity]);

  // Enhanced key press handler
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    trackActivity('keypress');
    
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTypingStop(); // Stop typing when sending message
      handleSendMessage();
    }
  }, [trackActivity, handleTypingStop]);

  // Enhanced send message handler
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !conversation || loading) return;

    const messageContent = inputValue.trim();
    setInputValue("");
    setLoading(true);

    // Stop typing when sending message
    handleTypingStop();
    
    // Track activity
    trackActivity('send_message');

    const messageType = "user";
    try {
      const result = await sendMessage(
        conversation.id,
        messageContent,
        messageType,
        user,
        userRole
      );

      if (result.error) {
        toast.error(result.error);
        setInputValue(messageContent);
      } else {
        setMessages((prev) => [...prev, result.data]);
        toast.success("Message sent!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setInputValue(messageContent);
    } finally {
      setLoading(false);
    }
  }, [inputValue, conversation, loading, handleTypingStop, trackActivity, user, userRole]);

  // Track chat window interactions
  const handleChatWindowClick = useCallback(() => {
    trackActivity('chat_interaction');
  }, [trackActivity]);

  const handleScrollActivity = useCallback(() => {
    trackActivity('scroll');
  }, [trackActivity]);

  // Initialize chat with activity tracking
  const initializeChat = async () => {
    setInitializing(true);
    trackActivity('initialize_chat');
    
    try {
      const convResult = await getOrCreateConversation(user);
      console.log("conversation Result", convResult);
      if (convResult.error) {
        toast.error(convResult.error);
        return;
      }

      setConversation(convResult.data);
      setCurrentUserId(convResult.data.user_id);

      const messagesResult = await getMessages(convResult.data.id);
      if (messagesResult.error) {
        toast.error(messagesResult.error);
        return;
      }

      setMessages(messagesResult.data || []);
      await markMessagesAsRead(convResult.data.id, user, userRole);
      
      trackActivity('chat_loaded');
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast.error("Failed to initialize chat");
    } finally {
      setInitializing(false);
    }
  };

  // Handle chat open/close with activity tracking
  const handleToggleChat = useCallback(() => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen) {
      trackActivity('open_chat');
    } else {
      trackActivity('close_chat');
      // Stop typing when closing chat
      handleTypingStop();
    }
  }, [isOpen, trackActivity, handleTypingStop]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, []);

  // Track when user becomes inactive (no mouse movement, clicks, etc.)
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseMove = () => trackActivity('mouse_move');
    const handleClick = () => trackActivity('click');
    const handleKeyDown = () => trackActivity('keydown');
    const handleFocus = () => trackActivity('focus');
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackActivity('tab_focus');
      } else {
        updatePresence({ status: 'away' });
      }
    };

    // Add event listeners for activity tracking
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen, trackActivity, updatePresence]);

  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUserMessage = (message: Message) => {
    return message.sender_id === currentUserId;
  };

  const renderReadConfirmation = (message: Message) => {
    if (message.message_type !== "user") {
      return null;
    }

    const hasAdminReadConfirmation = message.is_read === true;

    if (hasAdminReadConfirmation) {
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

  return (
    <>
      {/* Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleToggleChat}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          size="icon"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>

      {/* Glassmorphism Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-40 w-80 h-96 rounded-2xl backdrop-blur-md bg-white/10 border border-white/30 shadow-2xl animate-in slide-in-from-bottom-5 duration-300"
          onClick={handleChatWindowClick}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-semibold text-white">Chat Support</h3>
              {/* Show typing indicator */}
              {isTyping && (
                <span className="text-xs text-blue-300 italic">typing...</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea 
            className="h-82 p-4" 
            ref={scrollAreaRef}
            onScrollCapture={handleScrollActivity}
          >
            {initializing ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            ) : (
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-white/70 text-sm">
                    Welcome! How can we help you today?
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        isUserMessage(message) ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-2xl ${
                          isUserMessage(message)
                            ? "bg-blue-600 text-white"
                            : "bg-white/40 backdrop-blur-sm text-gray-800 border border-white/30"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatMessageTime(message.created_at)}
                        </p>
                      </div>
                      {renderReadConfirmation(message)}
                    </div>
                  ))
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-white/20">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onFocus={() => trackActivity('input_focus')}
                onBlur={handleTypingStop}
                placeholder="Type your message..."
                className="flex-1 bg-white/40 backdrop-blur-sm border-white/30 placeholder:text-gray-600 text-gray-800"
                disabled={loading || initializing || !conversation}
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={
                  loading || initializing || !conversation || !inputValue.trim()
                }
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
