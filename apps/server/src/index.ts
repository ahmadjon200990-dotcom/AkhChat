import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { registerChatSocket } from "./socket/index";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "AkhChat socket server",
  });
});

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

registerChatSocket(io);

const PORT = Number(process.env.PORT || 4000);

httpServer.listen(PORT, () => {
  console.log(`🚀 AkhChat server running on http://localhost:${PORT}`);
});