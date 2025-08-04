// import React from "react";
// import {
//   Send,
//   MessageCircle,
//   X,
//   Loader2,
//   Check,
//   CheckCheck,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useUserChat } from "@/hooks/useUserChat";

// const UserChatInterface: React.FC = () => {
//   const {
//     isOpen,
//     setIsOpen,
//     conversation,
//     messages,
//     newMessage,
//     setNewMessage,
//     isLoading,
//     isSending,
//     messagesEndRef,
//     handleSendMessage,
//     openChat,
//   } = useUserChat();

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   if (!isOpen) {
//     return (
//       <Button
//         onClick={openChat}
//         className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 z-50"
//         style={{
//           backdropFilter: 'blur(10px)',
//           backgroundColor: 'rgba(59, 130, 246, 0.8)',
//           border: '1px solid rgba(255, 255, 255, 0.2)',
//         }}
//       >
//         <MessageCircle className="h-6 w-6 text-white" />
//       </Button>
//     );
//   }

//   return (
//     <div 
//       className="fixed bottom-6 right-6 w-96 h-[800px] rounded-2xl shadow-2xl z-50 overflow-hidden"
//       style={{
//         backdropFilter: 'blur(20px)',
//         backgroundColor: 'rgba(255, 255, 255, 0.1)',
//         border: '1px solid rgba(255, 255, 255, 0.2)',
//         boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
//       }}
//     >
//       {/* Header */}
//       <div 
//         className="p-4 border-b flex items-center justify-between"
//         style={{
//           borderColor: 'rgba(255, 255, 255, 0.1)',
//           backgroundColor: 'rgba(255, 255, 255, 0.05)',
//         }}
//       >
//         <div className="flex items-center space-x-3">
//           <Avatar className="h-8 w-8">
//             <AvatarImage src="/admin-avatar.png" />
//             <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
//               AD
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <h3 className="font-semibold text-white text-sm">Support Chat</h3>
//             <p className="text-xs text-gray-300">We're here to help</p>
//           </div>
//         </div>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => setIsOpen(false)}
//           className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
//         >
//           <X className="h-4 w-4" />
//         </Button>
//       </div>

//       {/* Messages */}
//       <ScrollArea className="flex-1 p-4 h-[380px]"  data-lenis-prevent >
//         {isLoading ? (
//           <div className="flex items-center justify-center h-full">
//             <Loader2 className="h-6 w-6 animate-spin text-white" />
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${
//                   message.message_type === 'user' ? 'justify-end' : 'justify-start'
//                 }`}
//               >
//                 <div
//                   className={`max-w-[80%] rounded-2xl px-4 py-2 ${
//                     message.message_type === 'user'
//                       ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
//                       : 'text-white'
//                   }`}
//                   style={{
//                     backgroundColor: message.message_type === 'admin' 
//                       ? 'rgba(255, 255, 255, 0.1)' 
//                       : undefined,
//                     backdropFilter: message.message_type === 'admin' 
//                       ? 'blur(10px)' 
//                       : undefined,
//                     border: message.message_type === 'admin' 
//                       ? '1px solid rgba(255, 255, 255, 0.2)' 
//                       : undefined,
//                   }}
//                 >
//                   <p className="text-sm">{message.content}</p>
//                   <div className="flex items-center justify-end mt-1 space-x-1">
//                     <span className="text-xs opacity-70">
//                       {new Date(message.created_at).toLocaleTimeString([], {
//                         hour: '2-digit',
//                         minute: '2-digit',
//                       })}
//                     </span>
//                     {message.message_type === 'user' && (
//                       <div className="text-xs">
//                         {message.is_read ? (
//                           <CheckCheck className="h-3 w-3 text-blue-200" />
//                         ) : (
//                           <Check className="h-3 w-3 text-gray-300" />
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//         )}
//       </ScrollArea>

//       {/* Input */}
//       <div 
//         className="p-4 border-t"
//         style={{
//           borderColor: 'rgba(255, 255, 255, 0.1)',
//           backgroundColor: 'rgba(255, 255, 255, 0.05)',
//         }}
//       >
//         <div className="flex space-x-2">
//           <Input
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Type your message..."
//             disabled={isSending}
//             className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-white/40"
//             style={{
//               backdropFilter: 'blur(10px)',
//             }}
//           />
//           <Button
//             onClick={handleSendMessage}
//             disabled={!newMessage.trim() || isSending}
//             size="sm"
//             className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
//           >
//             {isSending ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <Send className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserChatInterface;


import React from "react";
import {
  Send,
  MessageCircle,
  X,
  Loader2,
  Check,
  CheckCheck,
  Circle, // Add this import for online indicator
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserChat } from "@/hooks/useUserChat";

const UserChatInterface: React.FC = () => {
  const {
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
    isAdminOnline: adminOnlineStatus, // Add this from your hook
  } = useUserChat();

  console.log("adminOnlineStatus",adminOnlineStatus)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Online status indicator for closed chat */}
        {adminOnlineStatus && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="relative">
              <Circle className="h-4 w-4 text-green-400 fill-current animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
            </div>
          </div>
        )}
        <Button
          onClick={openChat}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          style={{
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 w-96 h-[800px] rounded-2xl shadow-2xl z-50 overflow-hidden"
      style={{
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}
    >
      {/* Header with Online Status */}
      <div 
        className="p-4 border-b flex items-center justify-between"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/admin-avatar.png" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                AD
              </AvatarFallback>
            </Avatar>
            {/* Online status dot */}
            <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
              adminOnlineStatus ? 'bg-green-400' : 'bg-gray-400'
            }`}>
              {adminOnlineStatus && (
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Support Chat</h3>
            <p className={`text-xs flex items-center space-x-1 ${
              adminOnlineStatus ? 'text-green-300' : 'text-gray-400'
            }`}>
              <Circle className={`h-2 w-2 ${
                adminOnlineStatus ? 'text-green-400 fill-current' : 'text-gray-400 fill-current'
              }`} />
              <span>{adminOnlineStatus ? 'Online' : 'Offline'}</span>
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 h-[380px]" data-lenis-prevent>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Show offline message if admin is not online */}
            {!adminOnlineStatus && messages.length === 0 && (
              <div className="text-center py-8">
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-yellow-200 text-sm">
                    📴 Support team is currently offline
                  </p>
                  <p className="text-yellow-300/70 text-xs mt-1">
                    Send a message and we'll get back to you soon!
                  </p>
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.message_type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.message_type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'text-white'
                  }`}
                  style={{
                    backgroundColor: message.message_type === 'admin' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : undefined,
                    backdropFilter: message.message_type === 'admin' 
                      ? 'blur(10px)' 
                      : undefined,
                    border: message.message_type === 'admin' 
                      ? '1px solid rgba(255, 255, 255, 0.2)' 
                      : undefined,
                  }}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className="text-xs opacity-70">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {message.message_type === 'user' && (
                      <div className="text-xs">
                        {message.is_read ? (
                          <CheckCheck className="h-3 w-3 text-blue-200" />
                        ) : (
                          <Check className="h-3 w-3 text-gray-300" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input with Status Indicator */}
      <div 
        className="p-4 border-t"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Response time indicator */}
        {!adminOnlineStatus && (
          <div className="mb-2 text-center">
            <p className="text-xs text-gray-400">
              ⏰ Typical response time: 2-4 hours
            </p>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={adminOnlineStatus ? "Type your message..." : "Leave a message..."}
            disabled={isSending}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-white/40"
            style={{
              backdropFilter: 'blur(10px)',
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserChatInterface;
