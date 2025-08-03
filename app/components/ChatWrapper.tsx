'use client'
import React from 'react'
import { useUser } from '../context/UserContext'
import AdminChatInterface from './admin/AdminChatInterface';
import ChatBubble from './ChatBubble';

const ChatWrapper = () => {
    const { user, userRole } = useUser();
    
    return (
        <div>
            {user && (
                 userRole === "admin" ? <AdminChatInterface /> : <ChatBubble />
            )}
        </div>
    )
}

export default ChatWrapper
