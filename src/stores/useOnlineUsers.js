// stores/useOnlineUsers.js
import { create } from "zustand";

export const useOnlineUsers = create((set) => ({
  onlineUsers: {},
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  addOnlineUser: (user) =>
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, [user.id]: user },
    })),
  removeOnlineUser: (userId) =>
    set((state) => {
      const updated = { ...state.onlineUsers };
      delete updated[userId];
      return { onlineUsers: updated };
    }),
}));
