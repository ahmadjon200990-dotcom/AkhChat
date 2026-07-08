"use client";

import { useCallback, useRef, useState } from "react";
import { createPeerConnection } from "../lib/peer";
import type { PeerState, RemotePeerInfo } from "../types/webrtc";

type StartConnectionOptions = {
  localStream: MediaStream;
  onIceCandidate?: (candidate: RTCIceCandidate) => void;
};

type UseWebRTCReturn = {
  peerState: PeerState;
  remoteStream: MediaStream | null;
  remotePeer: RemotePeerInfo;
  startConnection: (options: StartConnectionOptions) => Promise<void>;
  createOffer: () => Promise<RTCSessionDescriptionInit | null>;
  createAnswer: (
    offer: RTCSessionDescriptionInit
  ) => Promise<RTCSessionDescriptionInit | null>;
  applyAnswer: (answer: RTCSessionDescriptionInit) => Promise<void>;
  addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
  setRemotePeerInfo: (peer: Partial<RemotePeerInfo>) => void;
  resetPeerState: () => void;
  closeConnection: () => void;
};

export function useWebRTC(): UseWebRTCReturn {
  const [peerState, setPeerState] = useState<PeerState>("idle");
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [remotePeer, setRemotePeer] = useState<RemotePeerInfo>({
    id: null,
  });

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const remoteDescriptionSetRef = useRef(false);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const flushPendingCandidates = useCallback(async () => {
    const peer = peerRef.current;
    if (!peer || !remoteDescriptionSetRef.current) return;

    const queued = [...pendingCandidatesRef.current];
    pendingCandidatesRef.current = [];

    for (const candidate of queued) {
      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("failed to apply queued ice candidate:", error);
      }
    }
  }, []);

  const startConnection = useCallback(
    async ({ localStream, onIceCandidate }: StartConnectionOptions) => {
      if (peerRef.current) return;

      const peer = createPeerConnection();
      peerRef.current = peer;

      remoteDescriptionSetRef.current = false;
      pendingCandidatesRef.current = [];

      setPeerState("connecting");

      const inboundStream = new MediaStream();
      setRemoteStream(inboundStream);

      localStream.getTracks().forEach((track) => {
        peer.addTrack(track, localStream);
      });

      peer.ontrack = (event) => {
        console.log("remote track received:", event.streams);

        event.streams[0]?.getTracks().forEach((track) => {
          const alreadyExists = inboundStream
            .getTracks()
            .some((existingTrack) => existingTrack.id === track.id);

          if (!alreadyExists) {
            inboundStream.addTrack(track);
          }
        });

        setRemoteStream(inboundStream);
      };

      peer.onicecandidate = (event) => {
        if (event.candidate && onIceCandidate) {
          console.log("local ice candidate created");
          onIceCandidate(event.candidate);
        }
      };

      peer.onconnectionstatechange = () => {
        const state = peer.connectionState;
        console.log("peer connection state:", state);

        if (state === "connected") {
          setPeerState("connected");
        }

        if (
          state === "failed" ||
          state === "closed" ||
          state === "disconnected"
        ) {
          setPeerState("ended");
        }
      };

      peer.oniceconnectionstatechange = () => {
        console.log("ice connection state:", peer.iceConnectionState);
      };
    },
    []
  );

  const createOffer = useCallback(async () => {
    const peer = peerRef.current;
    if (!peer) return null;

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    return offer;
  }, []);

  const createAnswer = useCallback(
    async (offer: RTCSessionDescriptionInit) => {
      const peer = peerRef.current;
      if (!peer) return null;

      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      remoteDescriptionSetRef.current = true;
      await flushPendingCandidates();

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      return answer;
    },
    [flushPendingCandidates]
  );

  const applyAnswer = useCallback(
    async (answer: RTCSessionDescriptionInit) => {
      const peer = peerRef.current;
      if (!peer) return;

      await peer.setRemoteDescription(new RTCSessionDescription(answer));
      remoteDescriptionSetRef.current = true;
      await flushPendingCandidates();
    },
    [flushPendingCandidates]
  );

  const addIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    const peer = peerRef.current;
    if (!peer) return;

    if (!remoteDescriptionSetRef.current) {
      pendingCandidatesRef.current.push(candidate);
      return;
    }

    try {
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("failed to add ice candidate:", error);
    }
  }, []);

  const setRemotePeerInfo = useCallback((peer: Partial<RemotePeerInfo>) => {
    setRemotePeer((prev) => ({
      ...prev,
      ...peer,
    }));
  }, []);

  const resetPeerState = useCallback(() => {
    remoteDescriptionSetRef.current = false;
    pendingCandidatesRef.current = [];
    setRemoteStream(null);
    setRemotePeer({ id: null });
    setPeerState("idle");
  }, []);

  const closeConnection = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.ontrack = null;
      peerRef.current.onicecandidate = null;
      peerRef.current.onconnectionstatechange = null;
      peerRef.current.oniceconnectionstatechange = null;
      peerRef.current.close();
      peerRef.current = null;
    }

    remoteDescriptionSetRef.current = false;
    pendingCandidatesRef.current = [];

    setRemoteStream(null);
    setRemotePeer({ id: null });
    setPeerState("ended");
  }, []);

  return {
    peerState,
    remoteStream,
    remotePeer,
    startConnection,
    createOffer,
    createAnswer,
    applyAnswer,
    addIceCandidate,
    setRemotePeerInfo,
    resetPeerState,
    closeConnection,
  };
}