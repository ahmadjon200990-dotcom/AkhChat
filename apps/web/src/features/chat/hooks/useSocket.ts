"use client";

import { useMemo } from "react";
import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

function getSocket() {
  if (socketInstance) return socketInstance;

  socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
    transports: ["websocket"],
  });

  return socketInstance;
}

export function useSocket() {
  return useMemo(() => getSocket(), []);
}