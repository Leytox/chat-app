import express from "express";
import authRoutes from "./routes/auth.route.ts";
import messageRoutes from "./routes/message.route.ts";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./lib/db.ts";
import { app, server } from "./lib/socket.ts";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.BASE_URL, credentials: true }));
app.use(morgan("dev"));

server.listen(PORT, () => {
  console.log("Server is running in port", PORT);
  connectDB();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
