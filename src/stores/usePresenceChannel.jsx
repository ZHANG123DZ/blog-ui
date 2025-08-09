import socketClient from "@/configs/socketClient";
import userService from "@/services/user/user.service";
import { useOnlineUsers } from "@/stores/useOnlineUsers";
import { useEffect, useRef } from "react";

export function usePresenceChannel() {
  const setOnlineUsers = useOnlineUsers((s) => s.setOnlineUsers);
  const addOnlineUser = useOnlineUsers((s) => s.addOnlineUser);
  const removeOnlineUser = useOnlineUsers((s) => s.removeOnlineUser);

  const offlineTimers = useRef({});

  useEffect(() => {
    const channel = socketClient.subscribe("presence-users");

    const OFFLINE_DELAY_MS = 1000;

    const clearOfflineTimer = (userId) => {
      if (offlineTimers.current[userId]) {
        clearTimeout(offlineTimers.current[userId]);
        delete offlineTimers.current[userId];
      }
    };

    const scheduleOffline = (userId) => {
      if (offlineTimers.current[userId]) return;

      offlineTimers.current[userId] = setTimeout(async () => {
        try {
          await userService.offline({ userId });
          removeOnlineUser(userId);
        } catch (error) {
          console.error("Error calling offline API:", error);
        }
        delete offlineTimers.current[userId];
      }, OFFLINE_DELAY_MS);
    };

    const handleBeforeUnload = () => {
      const curUserId = userService.getCurrentUserId?.() || null;
      if (curUserId) {
        scheduleOffline(curUserId);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    channel.bind("pusher:subscription_succeeded", (members) => {
      setOnlineUsers(members.members);

      Object.keys(offlineTimers.current).forEach(clearOfflineTimer);
    });

    channel.bind("pusher:member_added", async (member) => {
      clearOfflineTimer(member.id);
      try {
        await userService.online({ userId: member.id });
        addOnlineUser({ id: member.id, ...member.info });
      } catch (error) {
        console.error("Error calling online API:", error);
      }
    });

    channel.bind("pusher:member_removed", (member) => {
      scheduleOffline(member.id);
    });

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      channel.unbind_all();
      socketClient.unsubscribe("presence-users");

      Object.values(offlineTimers.current).forEach(clearTimeout);
      offlineTimers.current = {};
    };
  }, []);
}
