

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

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  conversation_count: number;
  last_conversation_date: string;
}

interface UserPresenceState {
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
}

interface UseAdminListenProps {
  user: any;
  userRole: string | null;
  users: User[];
  onMessageChange?: (payload: MessagePayload) => void;
  onConversationChange?: (payload: ConversationPayload) => void;
  onUserPresenceChange?: (onlineUsers: UserPresenceState[], offlineUsers: UserPresenceState[]) => void;
}

interface UseAdminListenReturn {
  isConnected: boolean;
  onlineUsers: UserPresenceState[];
  offlineUsers: UserPresenceState[];
  totalSubscribedUsers: number;
  onlineCount: number;
  reconnect: () => void;
  getUserPresenceById: (userId: string) => UserPresenceState | undefined;
}

export const useAdminListen = ({
  user,
  userRole,
  users,
  onMessageChange,
  onConversationChange,
  onUserPresenceChange,
}: UseAdminListenProps): UseAdminListenReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [userPresenceStates, setUserPresenceStates] = useState<UserPresenceState[]>([]);
  const [presenceInitialized, setPresenceInitialized] = useState(false);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const usersChannelRef = useRef<RealtimeChannel | null>(null);
  const supabase = useRef(createClient()).current;
  const lastPresenceUpdateRef = useRef<number>(0);
  const setupInProgressRef = useRef<boolean>(false);
  
  // Stable references for callbacks
  const onMessageChangeRef = useRef(onMessageChange);
  const onConversationChangeRef = useRef(onConversationChange);
  const onUserPresenceChangeRef = useRef(onUserPresenceChange);

  // Update callback refs
  useEffect(() => {
    onMessageChangeRef.current = onMessageChange;
  }, [onMessageChange]);

  useEffect(() => {
    onConversationChangeRef.current = onConversationChange;
  }, [onConversationChange]);

  useEffect(() => {
    onUserPresenceChangeRef.current = onUserPresenceChange;
  }, [onUserPresenceChange]);

  // Memoize users to prevent unnecessary re-renders
  const memoizedUsers = useMemo(() => users, [users]);
  const memoizedUsersLength = useMemo(() => users?.length || 0, [users]);

  // Initialize user presence states from users array - STABLE
  const initializeUserStates = useCallback(() => {
    if (!memoizedUsers || memoizedUsers.length === 0) return [];
    
    // console.log('[AdminListen] Initializing presence states for', memoizedUsers.length, 'users');
    
    return memoizedUsers.map(u => ({
      userId: u.id,
      email: u.email,
      full_name: u.full_name,
      avatar_url: u.avatar_url,
      role: u.role,
      isOnline: false,
      joinedAt: 0,
      lastSeen: 0,
      conversationId: null,
      isTyping: false,
      status: 'away' as const,
    }));
  }, [memoizedUsers]);

  // Update presence states based on channel presence - STABLE
  const updateUserPresenceStates = useCallback((presenceState: Record<string, any[]>) => {
    const now = Date.now();
    
    // Debounce rapid updates
    if (now - lastPresenceUpdateRef.current < 500) {
      return;
    }
    lastPresenceUpdateRef.current = now;

    // console.log('[AdminListen] Raw presence state:', presenceState);
    
    // Extract all online user IDs from presence state
    const onlineUserData = new Map<string, any>();
    
    Object.entries(presenceState).forEach(([presenceKey, presenceArray]) => {
      if (presenceArray && presenceArray.length > 0) {
        const latestPresence = presenceArray[0];
        if (latestPresence?.userId && !latestPresence?.isAdmin) {
          onlineUserData.set(latestPresence.userId, latestPresence);
        }
      }
    });

    // console.log('[AdminListen] Processed online users:', Array.from(onlineUserData.keys()));

    setUserPresenceStates(prevStates => {
      const updatedStates = prevStates.map(userState => {
        const onlineData = onlineUserData.get(userState.userId);
        const isOnline = !!onlineData;
        
        if (isOnline && onlineData) {
          return {
            ...userState,
            isOnline: true,
            joinedAt: onlineData.joinedAt || now,
            lastSeen: now,
            conversationId: onlineData.conversationId || null,
            isTyping: onlineData.isTyping || false,
            status: onlineData.status || 'active',
            email: onlineData.email || userState.email,
            full_name: onlineData.full_name || userState.full_name,
            avatar_url: onlineData.avatar_url !== undefined ? onlineData.avatar_url : userState.avatar_url,
          };
        } else {
          return {
            ...userState,
            isOnline: false,
            lastSeen: userState.isOnline ? now : userState.lastSeen,
            isTyping: false,
            status: 'away' as const,
          };
        }
      });

      const onlineCount = updatedStates.filter(u => u.isOnline).length;
      const offlineCount = updatedStates.filter(u => !u.isOnline).length;
      
      // console.log('[AdminListen] Presence updated:', {
      //   online: onlineCount,
      //   offline: offlineCount,
      //   total: updatedStates.length,
      //   onlineUsers: updatedStates.filter(u => u.isOnline).map(u => u.email)
      // });

      // Trigger callback with updated states
      if (onUserPresenceChangeRef.current) {
        const online = updatedStates.filter(u => u.isOnline);
        const offline = updatedStates.filter(u => !u.isOnline);
        onUserPresenceChangeRef.current(online, offline);
      }

      return updatedStates;
    });
  }, []); // Empty dependency array - function is stable

  // Setup admin users presence channel - STABLE
  const setupUsersPresenceChannel = useCallback(() => {
    if (!user || userRole !== "admin" || !memoizedUsers || memoizedUsers.length === 0) {
      // console.log('[AdminListen] Missing requirements for users presence channel');
      return;
    }

    if (setupInProgressRef.current) {
      // console.log('[AdminListen] Setup already in progress, skipping');
      return;
    }

    setupInProgressRef.current = true;

    // Clean up existing users channel
    if (usersChannelRef.current) {
      // console.log('[AdminListen] Cleaning up existing users channel');
      supabase.removeChannel(usersChannelRef.current);
      usersChannelRef.current = null;
    }

    // console.log(`[AdminListen] Setting up admin-users-channel for ${memoizedUsers.length} users`);
    
    // Initialize user states
    const initialStates = initializeUserStates();
    setUserPresenceStates(initialStates);
    setPresenceInitialized(false);

    const usersChannel = supabase
      .channel("admin-users-channel", {
        config: {
          presence: {
            key: user.id,
          },
        },
      })
      .on('presence', { event: 'sync' }, () => {
        const presenceState = usersChannel.presenceState();
        // console.log('[AdminListen] Users presence sync event:', {
        //   presenceKeys: Object.keys(presenceState),
        //   presenceState
        // });
        updateUserPresenceStates(presenceState);
        
        if (!presenceInitialized) {
          setPresenceInitialized(true);
          // console.log('[AdminListen] Presence system initialized');
        }
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        // console.log('[AdminListen] User joined admin-users-channel:', {
        //   key,
        //   newPresences,
        //   userData: newPresences[0]
        // });
        
        setTimeout(() => {
          const presenceState = usersChannel.presenceState();
          updateUserPresenceStates(presenceState);
        }, 100);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        // console.log('[AdminListen] User left admin-users-channel:', {
        //   key,
        //   leftPresences,
        //   userData: leftPresences[0]
        // });
        
        setTimeout(() => {
          const presenceState = usersChannel.presenceState();
          updateUserPresenceStates(presenceState);
        }, 100);
      });

    // Subscribe to users channel
    usersChannel.subscribe(async (status) => {
      // console.log('[AdminListen] Admin-users-channel subscription status:', status);
      
      if (status === 'SUBSCRIBED') {
        try {
          await usersChannel.track({
            userId: user.id,
            email: user.email || 'Admin',
            full_name: user.full_name || 'Admin User',
            avatar_url: user.avatar_url,
            role: 'admin',
            joinedAt: Date.now(),
            isAdmin: true,
            status: 'active',
          });
          
          // console.log('[AdminListen] Admin presence tracked in users channel');
          
          setTimeout(() => {
            const presenceState = usersChannel.presenceState();
            // console.log('[AdminListen] Initial presence state after admin join:', presenceState);
            updateUserPresenceStates(presenceState);
          }, 1000);
          
        } catch (error) {
          console.error('[AdminListen] Error tracking admin presence in users channel:', error);
        }
      } else if (status === 'CHANNEL_ERROR') {
        console.error('[AdminListen] Users channel error, attempting reconnect...');
        setTimeout(() => {
          setupInProgressRef.current = false;
          setupUsersPresenceChannel();
        }, 2000);
        return;
      }
      
      setupInProgressRef.current = false;
    });

    usersChannelRef.current = usersChannel;
  }, [user, userRole, memoizedUsersLength, initializeUserStates, updateUserPresenceStates, supabase]); // Stable dependencies

  // Setup main admin realtime channel for postgres changes - STABLE
  const setupAdminRealtimeChannel = useCallback(() => {
    if (!user || userRole !== "admin") {
      // console.log('[AdminListen] User is not admin, skipping admin realtime setup');
      return;
    }

    // Clean up existing channel
    if (channelRef.current) {
      // console.log('[AdminListen] Cleaning up existing admin realtime channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // console.log("[AdminListen] Setting up admin real-time listeners...");

    const adminChannel = supabase
      .channel("admin-realtime-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload: MessagePayload) => {
          // console.log("[AdminListen] Message change received!", payload);
          if (onMessageChangeRef.current) {
            onMessageChangeRef.current(payload);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_conversations" },
        (payload: ConversationPayload) => {
        //  console.log("[AdminListen] Conversation change received!", payload);
          if (onConversationChangeRef.current) { 
            onConversationChangeRef.current(payload);
          }
        }
      )
      .subscribe((status) => {
        // console.log("[AdminListen] Admin realtime subscription status:", status);
        setIsConnected(status === "SUBSCRIBED");
        
        if (status === "SUBSCRIBED") {
          setTimeout(() => setupUsersPresenceChannel(), 500);
        } else if (status === "CHANNEL_ERROR") {
          console.error('[AdminListen] Admin realtime channel error, attempting reconnect...');
          setIsConnected(false);
          setTimeout(() => setupAdminRealtimeChannel(), 3000);
        }
      });

    channelRef.current = adminChannel;
  }, [user, userRole, supabase, setupUsersPresenceChannel]); // Stable dependencies

  // Reconnect function - STABLE
  const reconnect = useCallback(() => {
    // console.log('[AdminListen] Manual reconnect triggered');
    setIsConnected(false);
    setPresenceInitialized(false);
    setUserPresenceStates([]);
    setupInProgressRef.current = false;
    
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (usersChannelRef.current) {
      supabase.removeChannel(usersChannelRef.current);
      usersChannelRef.current = null;
    }
    
    setTimeout(() => setupAdminRealtimeChannel(), 1000);
  }, [setupAdminRealtimeChannel, supabase]);

  // Get user presence by ID - STABLE
  const getUserPresenceById = useCallback((userId: string) => {
    return userPresenceStates.find(user => user.userId === userId);
  }, [userPresenceStates]);

  // Main effect to setup channels - RUNS ONLY ONCE
  useEffect(() => {
    if (!user || userRole !== "admin") {
      return;
    }

    setupAdminRealtimeChannel();

    return () => {
      // console.log("[AdminListen] Cleaning up admin subscriptions...");
      setupInProgressRef.current = false;

      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      if (usersChannelRef.current) {
        supabase.removeChannel(usersChannelRef.current);
        usersChannelRef.current = null;
      }

      setIsConnected(false);
      setUserPresenceStates([]);
      setPresenceInitialized(false);
    };
  }, [user?.id, userRole]); // Only depend on user ID and role

  // Handle users change separately - STABLE
  useEffect(() => {
    if (memoizedUsers && memoizedUsers.length > 0 && isConnected && !setupInProgressRef.current) {
      // console.log('[AdminListen] Users changed, updating presence channel');
      setupUsersPresenceChannel();
    }
  }, [memoizedUsersLength, isConnected, setupUsersPresenceChannel]); // Stable dependencies

  // Memoize return values
  const onlineUsers = useMemo(() => userPresenceStates.filter(user => user.isOnline), [userPresenceStates]);
  const offlineUsers = useMemo(() => userPresenceStates.filter(user => !user.isOnline), [userPresenceStates]);

  return useMemo(() => ({
    isConnected,
    onlineUsers,
    offlineUsers,
    totalSubscribedUsers: userPresenceStates.length,
    onlineCount: onlineUsers.length,
    reconnect,
    getUserPresenceById,
  }), [isConnected, onlineUsers, offlineUsers, userPresenceStates.length, reconnect, getUserPresenceById]);
};

