'use client'
import React from 'react'
import { useUser } from '../context/UserContext'
import AdminChatInterface from './admin/AdminChatInterface';
import ChatBubble from './ChatBubble';
import AdminChatInterfaceUpdated from './chat/AdminChatInterfaceUpdated';
import UserChatInterface from './chat/UserChatInterface';

const ChatWrapper = () => {
    const { user, userRole } = useUser();
    
    return (
        <div>
            {/* {user && (
                 userRole === "admin" ? <AdminChatInterface /> : <ChatBubble />
            )} */}

             {user && (
                 userRole === "admin" ? <AdminChatInterfaceUpdated /> : <UserChatInterface />
            )}
        </div>
    )
}

export default ChatWrapper
