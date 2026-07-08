export type MatchUser = {
  socketId: string;
  nickname?: string;
  country?: string;
};

export type SignalPayload = {
  from: string;
  to: string;
  signal: RTCSessionDescriptionInit | RTCIceCandidateInit;
};

export type PeerState =
  | "idle"
  | "searching"
  | "connecting"
  | "connected"
  | "ended";

export type RemotePeerInfo = {
  id: string | null;
  nickname?: string;
  country?: string;
};