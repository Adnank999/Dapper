// import React from "react";
// import {
//   Send,
//   MessageSquare,
//   User,
//   Clock,
//   Loader2,
//   CheckCheck,
//   Check,
//   Circle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useAdminChat } from "@/hooks/useAdminChat";

// const AdminChatInterfaceUpdated: React.FC = () => {
//   const {
//     conversations,
//     selectedConversation,
//     messages,
//     newMessage,
//     setNewMessage,
//     isLoading,
//     isSending,
//     onlineUsers,
//     handleSendReply,
//     selectConversation,
//     conversationUsers,
//     adminOnlineStatus,
//     isUserOnline,
//     getOnlineConversationUsers,
//   } = useAdminChat();

//   console.log("online users", onlineUsers);

//   console.log("conversationUsers",conversationUsers)
//   console.log("adminOnlineStatus",adminOnlineStatus)
//   console.log("isUserOnline",isUserOnline)


//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendReply();
//     }
//   };

//   const getUserStatus = (userId: string) => {
//     return onlineUsers.has(userId) ? "online" : "offline";
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "online":
//         return "text-green-400";
//       case "away":
//         return "text-yellow-400";
//       default:
//         return "text-gray-400";
//     }
//   };

//   return (
//     <div
//       className="h-[800px] w-full rounded-2xl overflow-hidden shadow-2xl"
//       style={{
//         backdropFilter: "blur(20px)",
//         backgroundColor: "rgba(255, 255, 255, 0.1)",
//         border: "1px solid rgba(255, 255, 255, 0.2)",
//         boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
//       }}
//     >
//       <div className="flex h-full">
//         {/* Conversations Sidebar */}
//         <div
//           className="w-1/3 border-r flex flex-col"
//           style={{
//             borderColor: "rgba(255, 255, 255, 0.1)",
//             backgroundColor: "rgba(255, 255, 255, 0.05)",
//           }}
//         >
//           {/* Header */}
//           <div
//             className="p-4 border-b"
//             style={{
//               borderColor: "rgba(255, 255, 255, 0.1)",
//             }}
//           >
//             <h2 className="text-lg font-semibold text-white flex items-center">
//               <MessageSquare className="h-5 w-5 mr-2" />
//               Chat Support
//             </h2>
//             <p className="text-sm text-gray-300 mt-1">
//               {conversations.length} conversation(s)
//             </p>
//           </div>

//           {/* Conversations List */}
//           <ScrollArea className="flex-1">
//             {isLoading ? (
//               <div className="flex items-center justify-center p-8">
//                 <Loader2 className="h-6 w-6 animate-spin text-white" />
//               </div>
//             ) : (
//               <div className="p-2">
//                 {conversations.map((conversation) => {
//                   const userStatus = getUserStatus(conversation.user_id);
//                   return (
//                     <div
//                       key={conversation.id}
//                       onClick={() => selectConversation(conversation)}
//                       className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
//                         selectedConversation?.id === conversation.id
//                           ? "bg-white/20"
//                           : "hover:bg-white/10"
//                       }`}
//                       style={{
//                         backdropFilter: "blur(10px)",
//                         border:
//                           selectedConversation?.id === conversation.id
//                             ? "1px solid rgba(255, 255, 255, 0.3)"
//                             : "1px solid rgba(255, 255, 255, 0.1)",
//                       }}
//                     >
//                       <div className="flex items-start space-x-3">
//                         <div className="relative">
//                           <Avatar className="h-10 w-10">
//                             <AvatarImage
//                               src={conversation.user.avatar_url || ""}
//                             />
//                             <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
//                               {conversation.user.full_name?.[0] || "U"}
//                             </AvatarFallback>
//                           </Avatar>
//                           <Circle
//                             className={`absolute -bottom-1 -right-1 h-4 w-4 ${getStatusColor(
//                               userStatus
//                             )} fill-current`}
//                           />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center justify-between">
//                             <h3 className="font-medium text-white text-sm truncate">
//                               {conversation.user.full_name || "Anonymous User"}
//                             </h3>
//                             {conversation.unread_count &&
//                               conversation.unread_count > 0 && (
//                                 <Badge
//                                   variant="secondary"
//                                   className="bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0"
//                                 >
//                                   {conversation.unread_count}
//                                 </Badge>
//                               )}
//                           </div>
//                           <p className="text-xs text-gray-300 capitalize flex items-center mt-1">
//                             <Circle
//                               className={`h-2 w-2 mr-1 ${getStatusColor(
//                                 userStatus
//                               )} fill-current`}
//                             />
//                             {userStatus}
//                           </p>
//                           {conversation.last_message && (
//                             <p className="text-xs text-gray-400 truncate mt-1">
//                               {conversation.last_message.content}
//                             </p>
//                           )}
//                           <p className="text-xs text-gray-500 mt-1">
//                             {new Date(
//                               conversation.updated_at
//                             ).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </ScrollArea>
//         </div>

//         {/* Chat Messages */}
//         <div className="flex-1 flex flex-col">
//           {selectedConversation ? (
//             <>
//               {/* Chat Header */}
//               <div
//                 className="p-4 border-b flex items-center"
//                 style={{
//                   borderColor: "rgba(255, 255, 255, 0.1)",
//                   backgroundColor: "rgba(255, 255, 255, 0.05)",
//                 }}
//               >
//                 <Avatar className="h-10 w-10 mr-3">
//                   <AvatarImage
//                     src={selectedConversation.user.avatar_url || ""}
//                   />
//                   <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
//                     {selectedConversation.user.full_name?.[0] || "U"}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h3 className="font-semibold text-white">
//                     {selectedConversation.user.full_name || "Anonymous User"}
//                   </h3>
//                   <p className="text-sm text-gray-300 flex items-center">
//                     <Circle
//                       className={`h-2 w-2 mr-1 ${getStatusColor(
//                         getUserStatus(selectedConversation.user_id)
//                       )} fill-current`}
//                     />
//                     {getUserStatus(selectedConversation.user_id)}

                   
//                   </p>
//                 </div>
//               </div>

//               {/* Messages */}
//               <ScrollArea className="h-screen flex-1 p-4" data-lenis-prevent>
//                 <div className="space-y-4">
//                   {messages.map((message) => (
//                     <div
//                       key={message.id}
//                       className={`flex ${
//                         message.message_type === "admin"
//                           ? "justify-end"
//                           : "justify-start"
//                       }`}
//                     >
//                       <div
//                         className={`max-w-[80%] rounded-2xl px-4 py-2 ${
//                           message.message_type === "admin"
//                             ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
//                             : "text-white"
//                         }`}
//                         style={{
//                           backgroundColor:
//                             message.message_type === "user"
//                               ? "rgba(255, 255, 255, 0.1)"
//                               : undefined,
//                           backdropFilter:
//                             message.message_type === "user"
//                               ? "blur(10px)"
//                               : undefined,
//                           border:
//                             message.message_type === "user"
//                               ? "1px solid rgba(255, 255, 255, 0.2)"
//                               : undefined,
//                         }}
//                       >
//                         <p className="text-sm">{message.content}</p>
//                         <div className="flex items-center justify-end mt-1 space-x-1">
//                           <span className="text-xs opacity-70">
//                             {new Date(message.created_at).toLocaleTimeString(
//                               [],
//                               {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                               }
//                             )}
//                           </span>
//                           {message.message_type === "admin" && (
//                             <div className="text-xs">
//                               {message.is_read ? (
//                                 <CheckCheck className="h-3 w-3 text-blue-200" />
//                               ) : (
//                                 <Check className="h-3 w-3 text-gray-300" />
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </ScrollArea>

//               {/* Message Input */}
//               <div
//                 className="p-4 border-t"
//                 style={{
//                   borderColor: "rgba(255, 255, 255, 0.1)",
//                   backgroundColor: "rgba(255, 255, 255, 0.05)",
//                 }}
//               >
//                 <div className="flex space-x-2">
//                   <Input
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     placeholder="Type your reply..."
//                     disabled={isSending}
//                     className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-white/40"
//                     style={{
//                       backdropFilter: "blur(10px)",
//                     }}
//                   />
//                   <Button
//                     onClick={handleSendReply}
//                     disabled={!newMessage.trim() || isSending}
//                     className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
//                   >
//                     {isSending ? (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                       <Send className="h-4 w-4" />
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-center text-gray-400">
//                 <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p className="text-lg">
//                   Select a conversation to start chatting
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminChatInterfaceUpdated;


import React from "react";
import {
  Send,
  MessageSquare,
  User,
  Clock,
  Loader2,
  CheckCheck,
  Check,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAdminChat } from "@/hooks/useAdminChat";

const AdminChatInterfaceUpdated: React.FC = () => {
  const {
    conversations,
    selectedConversation,
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    isSending,
    onlineUsers,
    handleSendReply,
    selectConversation,
    conversationUsers,
    adminOnlineStatus,
    isUserOnline,
    getOnlineConversationUsers,
  } = useAdminChat();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const getUserStatus = (userId: string) => {
    return onlineUsers.has(userId) ? "online" : "offline";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400";
      case "away":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  // Enhanced status indicator component
  const OnlineStatusIndicator = ({ userId, showText = false }: { userId: string, showText?: boolean }) => {
    const status = getUserStatus(userId);
    const isOnline = status === "online";
    
    return (
      <div className="flex items-center">
        <div className="relative">
          <Circle
            className={`h-3 w-3 ${getStatusColor(status)} fill-current`}
          />
          {isOnline && (
            <div className="absolute inset-0 h-3 w-3 bg-green-400 rounded-full animate-ping opacity-75" />
          )}
        </div>
        {showText && (
          <span className={`ml-1 text-xs capitalize ${getStatusColor(status)}`}>
            {status}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className="h-[800px] w-full rounded-2xl overflow-hidden shadow-2xl"
      style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      }}
    >
      <div className="flex h-full">
        {/* Conversations Sidebar */}
        <div
          className="w-1/3 border-r flex flex-col"
          style={{
            borderColor: "rgba(255, 255, 255, 0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Header */}
          <div
            className="p-4 border-b"
            style={{
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2 className="text-lg font-semibold text-white flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Chat Support
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              {conversations.length} conversation(s) • {getOnlineConversationUsers().length} online
            </p>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            ) : (
              <div className="p-2">
                {conversations.map((conversation) => {
                  const userStatus = getUserStatus(conversation.user_id);
                  const isOnline = userStatus === "online";
                  
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => selectConversation(conversation)}
                      className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                        selectedConversation?.id === conversation.id
                          ? "bg-white/20"
                          : "hover:bg-white/10"
                      } ${isOnline ? 'ring-1 ring-green-400/30' : ''}`}
                      style={{
                        backdropFilter: "blur(10px)",
                        border:
                          selectedConversation?.id === conversation.id
                            ? "1px solid rgba(255, 255, 255, 0.3)"
                            : "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={conversation.user.avatar_url || ""}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                              {conversation.user.full_name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          {/* Avatar status indicator */}
                          <div className="absolute -bottom-1 -right-1">
                            <div className="relative">
                              <Circle
                                className={`h-4 w-4 ${getStatusColor(userStatus)} fill-current border-2 border-white rounded-full`}
                              />
                              {isOnline && (
                                <div className="absolute inset-0 h-4 w-4 bg-green-400 rounded-full animate-ping opacity-75" />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            {/* Enhanced name with status */}
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <h3 className="font-medium text-white text-sm truncate">
                                {conversation.user.full_name || "Anonymous User"}
                              </h3>
                              <OnlineStatusIndicator userId={conversation.user_id} />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {/* Online badge for better visibility */}
                              {isOnline && (
                                <Badge 
                                  variant="outline" 
                                  className="bg-green-500/20 border-green-400/50 text-green-300 text-xs px-2 py-0.5"
                                >
                                  Online
                                </Badge>
                              )}
                              
                              {conversation.unread_count &&
                                conversation.unread_count > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0"
                                  >
                                    {conversation.unread_count}
                                  </Badge>
                                )}
                            </div>
                          </div>
                          
                          {/* Status text with timestamp */}
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-300 capitalize flex items-center">
                              <Circle
                                className={`h-2 w-2 mr-1 ${getStatusColor(userStatus)} fill-current`}
                              />
                              {userStatus}
                              {isOnline && (
                                <span className="ml-1 text-green-300">• Active now</span>
                              )}
                            </p>
                          </div>
                          
                          {conversation.last_message && (
                            <p className="text-xs text-gray-400 truncate mt-1">
                              {conversation.last_message.content}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(conversation.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Enhanced Chat Header with prominent status */}
              <div
                className="p-4 border-b flex items-center"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
              >
                <div className="relative mr-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedConversation.user.avatar_url || ""}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {selectedConversation.user.full_name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {/* Large status indicator for selected conversation */}
                  <div className="absolute -bottom-1 -right-1">
                    <div className="relative">
                      <Circle
                        className={`h-5 w-5 ${getStatusColor(
                          getUserStatus(selectedConversation.user_id)
                        )} fill-current border-2 border-white rounded-full`}
                      />
                      {getUserStatus(selectedConversation.user_id) === "online" && (
                        <div className="absolute inset-0 h-5 w-5 bg-green-400 rounded-full animate-ping opacity-75" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-white">
                      {selectedConversation.user.full_name || "Anonymous User"}
                    </h3>
                    
                    {/* Prominent online status badge */}
                    {getUserStatus(selectedConversation.user_id) === "online" ? (
                      <Badge className="bg-green-500/20 border border-green-400/50 text-green-300 text-xs px-2 py-1">
                        🟢 Online
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-gray-500/50 text-gray-400 text-xs px-2 py-1">
                        🔴 Offline
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-300 flex items-center mt-1">
                    <OnlineStatusIndicator 
                      userId={selectedConversation.user_id} 
                      showText={true} 
                    />
                    {getUserStatus(selectedConversation.user_id) === "online" && (
                      <span className="ml-2 text-green-300 text-xs">• Active now</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Rest of your existing message and input components remain the same */}
              <ScrollArea className="h-screen flex-1 p-4" data-lenis-prevent>
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
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.message_type === "admin"
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            : "text-white"
                        }`}
                        style={{
                          backgroundColor:
                            message.message_type === "user"
                              ? "rgba(255, 255, 255, 0.1)"
                              : undefined,
                          backdropFilter:
                            message.message_type === "user"
                              ? "blur(10px)"
                              : undefined,
                          border:
                            message.message_type === "user"
                              ? "1px solid rgba(255, 255, 255, 0.2)"
                              : undefined,
                        }}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          <span className="text-xs opacity-70">
                            {new Date(message.created_at).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          {message.message_type === "admin" && (
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
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div
                className="p-4 border-t"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
              >
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your reply..."
                    disabled={isSending}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-white/40"
                    style={{
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Button
                    onClick={handleSendReply}
                    disabled={!newMessage.trim() || isSending}
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatInterfaceUpdated;
