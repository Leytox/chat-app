import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/messages/users");
      set({ users: response.data });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (message) => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    set({ isSendingMessage: true });

    const socket = useAuthStore.getState().socket;
    try {
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        message,
      );
      set((state) => ({
        messages: [...state.messages, response.data],
      }));
      socket.emit("sendMessage", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSendingMessage: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    console.log("connected to io", socket);
    socket.on("newMessage", (message) => {
      console.log(message, selectedUser);
      if (message.senderId === selectedUser._id)
        set((state) => ({
          messages: [...state.messages, message],
        }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // todo:optimize this one later
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
