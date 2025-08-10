import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface MessagePayload {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: any;
  old: any;
  errors: any;
}

interface ConversationPayload {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: any;
  old: any;
  errors: any;
}

interface AdminPresenceState {
  userId: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  isOnline: boolean;
  joinedAt: number;
  lastSeen: number;
  conversationId?: string | null;
  isTyping?: boolean;
  status?: 'active' | 'away' | 'busy';
  isAdmin?: boolean;
}

interface UseUserListenProps {
  user: any;
  userRole: string | null;
  conversationId: string | null;
  enabled?: boolean;
  onNewMessage?: (message: any) => void;
  onMessageUpdate?: (message: any) => void;
  onConversationUpdate?: (conversation: any) => void;
  onAdminPresenceChange?: (adminPresence: AdminPresenceState | null) => void;
}

interface UseUserListenReturn {
  isConnected: boolean;
  adminPresence: AdminPresenceState | null;
  reconnect: () => void;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastMessageReceived: any;
}

export const useUserListen = ({
  user,
  userRole,
  conversationId,
  enabled = true,
  onNewMessage,
  onMessageUpdate,
  onConversationUpdate,
  onAdminPresenceChange,
}: UseUserListenProps): UseUserListenReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [adminPresence, setAdminPresence] = useState<AdminPresenceState | null>(null);
  const [lastMessageReceived, setLastMessageReceived] = useState<any>(null);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const presenceChannelRef = useRef<RealtimeChannel | null>(null);
  const supabase = useRef(createClient()).current;
  const setupInProgressRef = useRef<boolean>(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Stable references for callbacks
  const onNewMessageRef = useRef(onNewMessage);
  const onMessageUpdateRef = useRef(onMessageUpdate);
  const onConversationUpdateRef = useRef(onConversationUpdate);
  const onAdminPresenceChangeRef = useRef(onAdminPresenceChange);

  // Update callback refs
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  useEffect(() => {
    onMessageUpdateRef.current = onMessageUpdate;
  }, [onMessageUpdate]);

  useEffect(() => {
    onConversationUpdateRef.current = onConversationUpdate;
  }, [onConversationUpdate]);

  useEffect(() => {
    onAdminPresenceChangeRef.current = onAdminPresenceChange;
  }, [onAdminPresenceChange]);

  // Handle admin presence updates
  const updateAdminPresence = useCallback((presenceState: Record<string, any[]>) => {
    console.log('[UserListen] Raw admin presence state:', presenceState);
    
    let foundAdmin: AdminPresenceState | null = null;
    
    // Look for admin users in presence state
    Object.entries(presenceState).forEach(([presenceKey, presenceArray]) => {
      if (presenceArray && presenceArray.length > 0) {
        const latestPresence = presenceArray[0];
        if (latestPresence?.isAdmin && latestPresence?.role === 'admin') {
          foundAdmin = {
            userId: latestPresence.userId,
            email: latestPresence.email || 'Admin',
            full_name: latestPresence.full_name || 'Admin User',
            avatar_url: latestPresence.avatar_url || null,
            role: latestPresence.role,
            isOnline: true,
            joinedAt: latestPresence.joinedAt || Date.now(),
            lastSeen: Date.now(),
            conversationId: latestPresence.conversationId || null,
            isTyping: latestPresence.isTyping || false,
            status: latestPresence.status || 'active',
            isAdmin: true,
          };
        }
      }
    });

    setAdminPresence(foundAdmin);
    
    if (onAdminPresenceChangeRef.current) {
      onAdminPresenceChangeRef.current(foundAdmin);
    }
    
    console.log('[UserListen] Admin presence updated:', foundAdmin ? 'Online' : 'Offline');
  }, []);

  // Setup presence channel to listen for admin presence
  const setupPresenceChannel = useCallback(() => {
    if (!user || !enabled) {
      console.log('[UserListen] Missing requirements for presence channel');
      return;
    }

    // Clean up existing presence channel
    if (presenceChannelRef.current) {
      console.log('[UserListen] Cleaning up existing presence channel');
      supabase.removeChannel(presenceChannelRef.current);
      presenceChannelRef.current = null;
    }

    console.log('[UserListen] Setting up user presence channel');
    
    const presenceChannel = supabase
      .channel("admin-channel", {
        config: {
          presence: {
            key: user.id,
          },
        },
      })
      .on('presence', { event: 'sync' }, () => {
        const presenceState = presenceChannel.presenceState();
        console.log('[UserListen] Presence sync event:', presenceState);
        updateAdminPresence(presenceState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('[UserListen] Someone joined presence:', { key, newPresences });
        setTimeout(() => {
          const presenceState = presenceChannel.presenceState();
          updateAdminPresence(presenceState);
        }, 100);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('[UserListen] Someone left presence:', { key, leftPresences });
        setTimeout(() => {
          const presenceState = presenceChannel.presenceState();
          updateAdminPresence(presenceState);
        }, 100);
      });

    // Subscribe to presence channel
    presenceChannel.subscribe(async (status) => {
      console.log('[UserListen] Presence channel subscription status:', status);
      
      if (status === 'SUBSCRIBED') {
        try {
          // Track user presence (not admin)
          await presenceChannel.track({
            userId: user.id,
            email: user.email || 'User',
            full_name: user.full_name || 'User',
            avatar_url: user.avatar_url,
            role: userRole || 'user',
            joinedAt: Date.now(),
            isAdmin: false,
            status: 'active',
            conversationId: conversationId,
          });
          
          console.log('[UserListen] User presence tracked in admin-users-channel');
          
          // Get initial presence state
          setTimeout(() => {
            const presenceState = presenceChannel.presenceState();
            updateAdminPresence(presenceState);
          }, 1000);
          
        } catch (error) {
          console.error('[UserListen] Error tracking user presence:', error);
        }
      } else if (status === 'CHANNEL_ERROR') {
        console.error('[UserListen] Presence channel error');
        setAdminPresence(null);
      }
    });

    presenceChannelRef.current = presenceChannel;
  }, [user, enabled, userRole, conversationId, updateAdminPresence, supabase]);

  // Setup main realtime channel for postgres changes
  const setupRealtimeChannel = useCallback(() => {
    if (!user || !enabled) {
      console.log('[UserListen] User not available or disabled, skipping realtime setup');
      return;
    }

    if (setupInProgressRef.current) {
      console.log('[UserListen] Setup already in progress, skipping');
      return;
    }

    setupInProgressRef.current = true;
    setConnectionStatus('connecting');

    // Clean up existing channel
    if (channelRef.current) {
      console.log('[UserListen] Cleaning up existing realtime channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log("[UserListen] Setting up user real-time listeners...");

    const realtimeChannel = supabase
      .channel(`user-realtime-${user.id}`)
      .on(
        "postgres_changes",
        { 
          event: "INSERT", 
          schema: "public", 
          table: "messages",
          filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined
        },
        (payload: MessagePayload) => {
          console.log("[UserListen] New message received!", payload);
          setLastMessageReceived(payload.new);
          
          if (onNewMessageRef.current) {
            onNewMessageRef.current(payload.new);
          }
        }
      )
      .on(
        "postgres_changes",
        { 
          event: "UPDATE", 
          schema: "public", 
          table: "messages",
          filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined
        },
        (payload: MessagePayload) => {
          console.log("[UserListen] Message updated!", payload);
          
          if (onMessageUpdateRef.current) {
            onMessageUpdateRef.current(payload.new);
          }
        }
      )
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "chat_conversations",
          filter: conversationId ? `id=eq.${conversationId}` : `user_id=eq.${user.id}`
        },
        (payload: ConversationPayload) => {
          console.log("[UserListen] Conversation updated!", payload);
          
          if (onConversationUpdateRef.current) {
            onConversationUpdateRef.current(payload.new);
          }
        }
      )
      .subscribe((status) => {
        console.log("[UserListen] Realtime subscription status:", status);
        
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          setConnectionStatus('connected');
          // Setup presence channel after main channel is connected
          setTimeout(() => setupPresenceChannel(), 500);
        } else if (status === "CHANNEL_ERROR") {
          console.error('[UserListen] Realtime channel error, attempting reconnect...');
          setIsConnected(false);
          setConnectionStatus('error');
          setAdminPresence(null);
          
          // Attempt reconnection after delay
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setupInProgressRef.current = false;
            setupRealtimeChannel();
          }, 3000);
        } else if (status === "CLOSED") {
          setIsConnected(false);
          setConnectionStatus('disconnected');
          setAdminPresence(null);
        }
        
        setupInProgressRef.current = false;
      });

    channelRef.current = realtimeChannel;
  }, [user, enabled, conversationId, supabase, setupPresenceChannel]);

  // Reconnect function
  const reconnect = useCallback(() => {
    console.log('[UserListen] Manual reconnect triggered');
    setIsConnected(false);
    setConnectionStatus('connecting');
    setAdminPresence(null);
    setupInProgressRef.current = false;
    
    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Clean up existing channels
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (presenceChannelRef.current) {
      supabase.removeChannel(presenceChannelRef.current);
      presenceChannelRef.current = null;
    }
    
    setTimeout(() => setupRealtimeChannel(), 1000);
  }, [setupRealtimeChannel, supabase]);

  // Main effect to setup channels
  useEffect(() => {
    if (!user || !enabled) {
      return;
    }

    setupRealtimeChannel();

    return () => {
      console.log("[UserListen] Cleaning up user subscriptions...");
      setupInProgressRef.current = false;
      
      // Clear reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Clean up channels
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      if (presenceChannelRef.current) {
        supabase.removeChannel(presenceChannelRef.current);
        presenceChannelRef.current = null;
      }

      setIsConnected(false);
      setConnectionStatus('disconnected');
      setAdminPresence(null);
    };
  }, [user?.id, enabled, setupRealtimeChannel]);

  // Return memoized values
  return useMemo(() => ({
    isConnected,
    adminPresence,
    reconnect,
    connectionStatus,
    lastMessageReceived,
  }), [isConnected, adminPresence, reconnect, connectionStatus, lastMessageReceived]);
};
