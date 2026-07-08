import type { Server, Socket } from "socket.io";
import {
  addToQueue,
  findMatchFor,
  getQueueUser,
  removeFromQueue,
} from "../lib/matchmaking";

type MatchFindPayload = {
  nickname?: string;
  age?: number;
  region?: string;
};

type SignalPayload = {
  to: string;
  signal: unknown;
};

const SOCKET_EVENTS = {
  MATCH_FIND: "match:find",
  MATCH_FOUND: "match:found",
  MATCH_NEXT: "match:next",
  MATCH_LEAVE: "match:leave",

  WEBRTC_OFFER: "webrtc:offer",
  WEBRTC_ANSWER: "webrtc:answer",
  WEBRTC_ICE_CANDIDATE: "webrtc:ice-candidate",

  PEER_DISCONNECTED: "peer:disconnected",
} as const;

const activePartners = new Map<string, string>();

function setPartners(a: string, b: string) {
  activePartners.set(a, b);
  activePartners.set(b, a);
}

function clearPartner(socketId: string) {
  const partnerId = activePartners.get(socketId);

  activePartners.delete(socketId);

  if (partnerId) {
    activePartners.delete(partnerId);
  }

  return partnerId || null;
}

function getPartner(socketId: string) {
  return activePartners.get(socketId) || null;
}

export function registerChatSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("socket connected:", socket.id);

    socket.on(SOCKET_EVENTS.MATCH_FIND, (payload: MatchFindPayload) => {
      removeFromQueue(socket.id);

      addToQueue({
        socketId: socket.id,
        nickname: payload?.nickname,
        age: payload?.age,
        region: payload?.region,
      });

      const match = findMatchFor(socket.id);

      if (!match) return;

      setPartners(match.userA.socketId, match.userB.socketId);

      io.to(match.userA.socketId).emit(SOCKET_EVENTS.MATCH_FOUND, {
        partner: match.userB,
        isInitiator: true,
      });

      io.to(match.userB.socketId).emit(SOCKET_EVENTS.MATCH_FOUND, {
        partner: match.userA,
        isInitiator: false,
      });
    });

    socket.on(SOCKET_EVENTS.MATCH_NEXT, () => {
      const partnerId = clearPartner(socket.id);

      if (partnerId) {
        io.to(partnerId).emit(SOCKET_EVENTS.PEER_DISCONNECTED);
      }

      removeFromQueue(socket.id);
    });

    socket.on(SOCKET_EVENTS.MATCH_LEAVE, () => {
      const partnerId = clearPartner(socket.id);

      if (partnerId) {
        io.to(partnerId).emit(SOCKET_EVENTS.PEER_DISCONNECTED);
      }

      removeFromQueue(socket.id);
    });

    socket.on(SOCKET_EVENTS.WEBRTC_OFFER, (payload: SignalPayload) => {
      io.to(payload.to).emit(SOCKET_EVENTS.WEBRTC_OFFER, {
        from: socket.id,
        to: payload.to,
        signal: payload.signal,
      });
    });

    socket.on(SOCKET_EVENTS.WEBRTC_ANSWER, (payload: SignalPayload) => {
      io.to(payload.to).emit(SOCKET_EVENTS.WEBRTC_ANSWER, {
        from: socket.id,
        to: payload.to,
        signal: payload.signal,
      });
    });

    socket.on(SOCKET_EVENTS.WEBRTC_ICE_CANDIDATE, (payload: SignalPayload) => {
      io.to(payload.to).emit(SOCKET_EVENTS.WEBRTC_ICE_CANDIDATE, {
        from: socket.id,
        to: payload.to,
        signal: payload.signal,
      });
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected:", socket.id);

      removeFromQueue(socket.id);

      const partnerId = clearPartner(socket.id);

      if (partnerId) {
        io.to(partnerId).emit(SOCKET_EVENTS.PEER_DISCONNECTED);
      }

      const queuedUser = getQueueUser(socket.id);
      if (queuedUser) {
        removeFromQueue(socket.id);
      }
    });
  });
}