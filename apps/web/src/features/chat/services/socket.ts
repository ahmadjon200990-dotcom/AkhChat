import { io, type Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export function getSocket() {
  if (socketInstance) {
    return socketInstance;
  }

  socketInstance = io(
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
    {
      autoConnect: false,
      transports: ["websocket"],
    }
  );

  return socketInstance;
}