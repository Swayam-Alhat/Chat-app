import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { WebSocketServer } from "ws";

import {
  handleSignup,
  handleLogin,
  handleLogout,
  showUsers,
  showMessages,
  addMessage,
} from "./controllers/controllers.js";
import { getToken, getUserFromToken } from "../lib/utils.js";

import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { checkCookie } from "./middleware/auth.js";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
// create websocket server
const wss = new WebSocketServer({ server: httpServer });

const PORT = process.env.PORT || 3000;

// cors
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  }),
);

// middlewares
app.use(cookieParser());
app.use(express.json());

// routes
app.post("/api/signup", handleSignup);
app.post("/api/login", handleLogin);
app.post("/api/logout", handleLogout);
app.get("/api/users", checkCookie, showUsers);
app.get("/api/messages/:id", checkCookie, showMessages);
app.post("/api/addmessage/:id", checkCookie, addMessage);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_STRING);
    console.log("DB connection successfull");

    httpServer.listen(PORT, () => {
      console.log("Server started at PORT: ", PORT);
    });
  } catch (error) {
    console.log("Error while DB connection, ", error);
  }
};

connectDB();

// use wss for connection with client
wss.on("connection", (ws, req) => {
  console.log("Client connected!");

  // get token, decode it and assign userId to ws (client instance)
  const token = getToken(req);
  const user = getUserFromToken(token);
  // assign id as key to ws object, So we can identify each unique ws (client connection)
  ws.id = user.id;

  // send connected clients to all users
  wss.clients.forEach((client) => {
    let onlineUsers = [];
    wss.clients.forEach((client) => {
      onlineUsers.push(client.id);
    });

    client.send(
      JSON.stringify({ type: "online_users", onlineUsers: onlineUsers }),
    );
  });

  // listen for new message
  ws.on("message", (data) => {
    // parse converts JSON string into JSON object
    const convertedData = JSON.parse(data);

    if (convertedData && convertedData.type === "new_message") {
      wss.clients.forEach((client) => {
        if (client.id === convertedData.chatPartner._id) {
          // while sending data, always send it in string form
          client.send(JSON.stringify(convertedData));
        }
      });
    }
  });

  ws.on("close", () => {
    // send connected clients to all users
    wss.clients.forEach((client) => {
      let onlineUsers = [];
      wss.clients.forEach((client) => {
        onlineUsers.push(client.id);
      });

      client.send(
        JSON.stringify({ type: "online_users", onlineUsers: onlineUsers }),
      );
    });
  });
});
