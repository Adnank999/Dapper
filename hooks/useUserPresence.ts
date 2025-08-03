// // hooks/useUserPresence.ts (Enhanced version)
// import { useEffect, useRef } from "react";
// import { createClient } from "@/utils/supabase/client";
// import type { RealtimeChannel, User } from "@supabase/supabase-js";

// interface UseUserPresenceProps {
//   user: User;
//   userRole?: string | null;
//   isAdmin: boolean;
//   enabled?: boolean;
//   conversationId?: string; // Add conversation context
//   isTyping?: boolean; // Track typing status
//   lastActivity?: number; // Track last activity
// }

// export const useUserPresence = ({ 
//   user, 
//   userRole,
//   enabled = true, 
//   conversationId,
//   isTyping = false,
//   lastActivity
// }: UseUserPresenceProps) => {
//   const channelRef = useRef<RealtimeChannel | null>(null);
//   const supabase = useRef(createClient()).current;

//   useEffect(() => {
//     if (!user?.id || !enabled) {
//       console.log('[UserPresence] User presence disabled or no user');
//       return;
//     }

//     // Clean up existing channel
//     if (channelRef.current) {
//       console.log('[UserPresence] Cleaning up existing presence channel');
//       supabase.removeChannel(channelRef.current);
//       channelRef.current = null;
//     }

//     console.log(`[UserPresence] User ${user.email} joining admin-users-channel`);

//     // Join the same channel that admin is monitoring
//     const presenceChannel = supabase
//       .channel("admin-users-channel", {
//         config: {
//           presence: {
//             key: user.id,
//           },
//         },
//       })
//       .on('presence', { event: 'sync' }, () => {
//         console.log('[UserPresence] Presence synced for user:', user.email);
//       });

//     // Subscribe and track presence
//     presenceChannel.subscribe(async (status) => {
//       console.log(`[UserPresence] ${user.email} subscription status:`, status);
      
//       if (status === 'SUBSCRIBED') {
//         try {
//           await presenceChannel.track({
//             userId: user.id,
//             email: user.email,
//             full_name: user.full_name || user.email,
//             avatar_url: user.avatar_url,
//             role: user.role || 'user',
//             joinedAt: Date.now(),
//             isAdmin: false,
//             // Enhanced chat context
//             conversationId: conversationId || null,
//             isTyping: isTyping,
//             lastActivity: lastActivity || Date.now(),
//             status: 'active', // active, away, busy
//           });
          
//           console.log(`[UserPresence] ${user.email} presence tracked successfully`);
//         } catch (error) {
//           console.error(`[UserPresence] Error tracking presence for ${user.email}:`, error);
//         }
//       }
//     });

//     channelRef.current = presenceChannel;

//     // Cleanup
//     return () => {
//       console.log(`[UserPresence] Cleaning up presence for ${user.email}`);
//       if (channelRef.current) {
//         supabase.removeChannel(channelRef.current);
//         channelRef.current = null;
//       }
//     };
//   }, [user?.id, user?.email, enabled, conversationId, isTyping, lastActivity]);

//   // Return a function to update presence data
//   const updatePresence = async (updates: Partial<{
//     isTyping: boolean;
//     lastActivity: number;
//     status: 'active' | 'away' | 'busy';
//   }>) => {
//     if (channelRef.current) {
//       try {
//         await channelRef.current.track({
//           userId: user.id,
//           email: user.email,
//           full_name: user.full_name || user.email,
//           avatar_url: user.avatar_url,
//           role: user.role || 'user',
//           joinedAt: Date.now(),
//           isAdmin: false,
//           conversationId: conversationId || null,
//           lastActivity: Date.now(),
//           ...updates,
//         });
//       } catch (error) {
//         console.error('[UserPresence] Error updating presence:', error);
//       }
//     }
//   };

//   return { updatePresence };
// };



// hooks/useUserPresence.ts (Enhanced with admin observer capabilities)
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { RealtimeChannel, User } from "@supabase/supabase-js";

interface UseUserPresenceProps {
  user: User | null;
  userRole?: string | null;
  isAdmin?: boolean;
  enabled?: boolean;
  conversationId?: string;
  isTyping?: boolean;
  lastActivity?: number;
  observerMode?: boolean; // NEW: For admin to observe all users
}

interface UserPresenceData {
  userId: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  joinedAt: number;
  isAdmin: boolean;
  conversationId?: string;
  isTyping: boolean;
  lastActivity: number;
  status: 'active' | 'away' | 'busy';
}

export const useUserPresence = ({ 
  user, 
  userRole,
  isAdmin = false,
  enabled = true, 
  conversationId,
  isTyping = false,
  lastActivity,
  observerMode = false // NEW: Admin observer mode
}: UseUserPresenceProps) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = useRef(createClient()).current;
  
  // NEW: State to hold all observed users (for admin)
  const [allUsers, setAllUsers] = useState<Record<string, UserPresenceData>>({});
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);

  useEffect(() => {
    if (!user?.id || !enabled) {
      console.log('[UserPresence] User presence disabled or no user');
      return;
    }

    // Clean up existing channel
    if (channelRef.current) {
      console.log('[UserPresence] Cleaning up existing presence channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const userType = observerMode ? 'Admin Observer' : 'User';
    console.log(`[UserPresence] ${userType} ${user.email} joining admin-users-channel`);

    // Join the same channel that admin is monitoring
    const presenceChannel = supabase
      .channel("admin-users-channel", {
        config: {
          presence: {
            key: observerMode ? `admin-${user.id}` : user.id, // Different key for admin observers
          },
        },
      })
      .on('presence', { event: 'sync' }, () => {
        console.log('[UserPresence] Presence synced for user:', user.email);
        
        // NEW: If in observer mode (admin), collect all user data
        if (observerMode) {
          const state = presenceChannel.presenceState();
          const users: Record<string, UserPresenceData> = {};
          let count = 0;
          
          Object.entries(state).forEach(([key, presences]) => {
            // Skip admin observers, only track actual users
            if (!key.startsWith('admin-') && presences.length > 0) {
              const latestPresence = presences[presences.length - 1] as any;
              users[key] = {
                userId: latestPresence.userId,
                email: latestPresence.email,
                full_name: latestPresence.full_name,
                avatar_url: latestPresence.avatar_url,
                role: latestPresence.role,
                joinedAt: latestPresence.joinedAt,
                isAdmin: latestPresence.isAdmin,
                conversationId: latestPresence.conversationId,
                isTyping: latestPresence.isTyping,
                lastActivity: latestPresence.lastActivity,
                status: latestPresence.status
              };
              count++;
            }
          });
          
          setAllUsers(users);
          setOnlineUsersCount(count);
          console.log(`[UserPresence] Admin observing ${count} users:`, users);
        }
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log(`[UserPresence] User joined - Key: ${key}`, newPresences);
        
        // NEW: Update admin view when users join
        if (observerMode && !key.startsWith('admin-')) {
          newPresences.forEach((presence: any) => {
            setAllUsers(prev => ({
              ...prev,
              [key]: {
                userId: presence.userId,
                email: presence.email,
                full_name: presence.full_name,
                avatar_url: presence.avatar_url,
                role: presence.role,
                joinedAt: presence.joinedAt,
                isAdmin: presence.isAdmin,
                conversationId: presence.conversationId,
                isTyping: presence.isTyping,
                lastActivity: presence.lastActivity,
                status: presence.status
              }
            }));
            setOnlineUsersCount(prev => prev + 1);
          });
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log(`[UserPresence] User left - Key: ${key}`, leftPresences);
        
        // NEW: Update admin view when users leave
        if (observerMode && !key.startsWith('admin-')) {
          setAllUsers(prev => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
          });
          setOnlineUsersCount(prev => Math.max(0, prev - 1));
        }
      });

    // Subscribe and track presence
    presenceChannel.subscribe(async (status) => {
      console.log(`[UserPresence] ${user.email} subscription status:`, status);
      
      if (status === 'SUBSCRIBED') {
        try {
          await presenceChannel.track({
            userId: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email,
            avatar_url: user.user_metadata?.avatar_url,
            role: userRole || 'user',
            joinedAt: Date.now(),
            isAdmin: isAdmin,
            // Enhanced chat context
            conversationId: conversationId || null,
            isTyping: isTyping,
            lastActivity: lastActivity || Date.now(),
            status: 'active', // active, away, busy
            observerMode: observerMode, // Flag to identify observers
          });
          
          console.log(`[UserPresence] ${user.email} presence tracked successfully`);
        } catch (error) {
          console.error(`[UserPresence] Error tracking presence for ${user.email}:`, error);
        }
      }
    });

    channelRef.current = presenceChannel;

    // Cleanup
    return () => {
      console.log(`[UserPresence] Cleaning up presence for ${user.email}`);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id, user?.email, enabled, conversationId, isTyping, lastActivity, observerMode]);

  // Return a function to update presence data
  const updatePresence = async (updates: Partial<{
    isTyping: boolean;
    lastActivity: number;
    status: 'active' | 'away' | 'busy';
    conversationId?: string;
  }>) => {
    if (channelRef.current) {
      try {
        await channelRef.current.track({
          userId: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email,
          avatar_url: user.user_metadata?.avatar_url,
          role: userRole || 'user',
          joinedAt: Date.now(),
          isAdmin: isAdmin,
          conversationId: conversationId || null,
          lastActivity: Date.now(),
          observerMode: observerMode,
          ...updates,
        });
      } catch (error) {
        console.error('[UserPresence] Error updating presence:', error);
      }
    }
  };

  return { 
    updatePresence,
    // NEW: Return observed data for admin
    allUsers: observerMode ? allUsers : {},
    onlineUsersCount: observerMode ? onlineUsersCount : 0,
    isObserving: observerMode
  };
};
