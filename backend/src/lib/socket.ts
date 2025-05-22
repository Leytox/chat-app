import { Server } from "socket.io";
import http from "http";
import express from "express";
import { redis } from "./redis.ts";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.BASE_URL as string],
  },
});

export async function getReceiverSocketId(userId: string) {
  try {
    return await redis.get(userId);
  } catch (err) {
    console.error("Error retrieving socket ID from Redis:", err);
    return null;
  }
}

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId as string;
  if (userId) await redis.set(userId, socket.id);

  try {
    const onlineUsers = await redis.keys("*");
    io.emit("getOnlineUsers", onlineUsers);
  } catch (err) {
    console.error("Error getting online users:", err);
  }

  socket.on("typing", async ({ senderId, receiverId, isTyping }) => {
    try {
      console.log(senderId, receiverId, isTyping);
      const receiverSocketId = await getReceiverSocketId(receiverId);
      console.log(receiverSocketId);
      if (receiverSocketId)
        io.to(receiverSocketId).emit("typing", { senderId, isTyping });
    } catch (err) {
      console.error("Error getting receiver socket ID:", err);
    }
  });

  socket.on("disconnect", async () => {
    if (userId) await redis.del(userId);

    try {
      const onlineUsers = await redis.keys("*");
      io.emit("getOnlineUsers", onlineUsers);
    } catch (err) {
      console.error("Error getting online users after disconnect:", err);
    }
  });
});

export { io, app, server };
