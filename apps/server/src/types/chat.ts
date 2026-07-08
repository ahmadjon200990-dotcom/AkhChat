export type QueueUser = {
  socketId: string;
  nickname?: string;
  age?: number;
  region?: string;
};

export type MatchPair = {
  userA: QueueUser;
  userB: QueueUser;
};