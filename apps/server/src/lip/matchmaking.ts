import type { MatchPair, QueueUser } from "../types/chat";

const waitingQueue = new Map<string, QueueUser>();

export function addToQueue(user: QueueUser) {
  waitingQueue.set(user.socketId, user);
}

export function removeFromQueue(socketId: string) {
  waitingQueue.delete(socketId);
}

export function getQueueUser(socketId: string) {
  return waitingQueue.get(socketId) || null;
}

export function findMatchFor(socketId: string): MatchPair | null {
  const currentUser = waitingQueue.get(socketId);
  if (!currentUser) return null;

  for (const [candidateId, candidate] of waitingQueue.entries()) {
    if (candidateId !== socketId) {
      waitingQueue.delete(socketId);
      waitingQueue.delete(candidateId);

      return {
        userA: currentUser,
        userB: candidate,
      };
    }
  }

  return null;
}