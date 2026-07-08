export const SOCKET_EVENTS = {
  MATCH_FIND: "match:find",
  MATCH_FOUND: "match:found",
  MATCH_NEXT: "match:next",
  MATCH_LEAVE: "match:leave",

  WEBRTC_OFFER: "webrtc:offer",
  WEBRTC_ANSWER: "webrtc:answer",
  WEBRTC_ICE_CANDIDATE: "webrtc:ice-candidate",

  PEER_DISCONNECTED: "peer:disconnected",
} as const;