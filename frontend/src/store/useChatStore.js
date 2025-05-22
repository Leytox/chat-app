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
  isTyping: false,

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
        message
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
    socket.on("newMessage", (message) => {
      if (message.senderId === selectedUser._id)
        set((state) => ({
          messages: [...state.messages, message],
        }));
    });

    socket.on("typing", ({ senderId, isTyping }) => {
      if (senderId === selectedUser._id) set({ isTyping });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("typing");
  },

  setSelectedUser: (user) => set({ selectedUser: user }),

  typeToUser: (isTyping) => {
    const socket = useAuthStore.getState().socket;
    const currentUserId = useAuthStore.getState().authUser._id;
    const { selectedUser } = get();
    console.log(currentUserId, selectedUser._id, isTyping);
    socket.emit("typing", {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      isTyping,
    });
  },
}));
