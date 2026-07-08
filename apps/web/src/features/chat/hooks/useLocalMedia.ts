"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type MediaStatus = "idle" | "requesting" | "ready" | "error";

type UseLocalMediaReturn = {
  stream: MediaStream | null;
  status: MediaStatus;
  error: string | null;
  isMicEnabled: boolean;
  isCameraEnabled: boolean;
  requestMedia: () => Promise<void>;
  stopMedia: () => void;
  toggleMic: () => void;
  toggleCamera: () => void;
};

export function useLocalMedia(): UseLocalMediaReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<MediaStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const requestMedia = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setError("Media devices API is not supported in this browser.");
      return;
    }

    try {
      setStatus("requesting");
      setError(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setStatus("ready");
    } catch (err) {
      console.error("Failed to get local media:", err);
      setStatus("error");
      setError("Camera or microphone access was denied.");
    }
  }, []);

  const stopMedia = useCallback(() => {
    const current = streamRef.current;

    if (current) {
      current.getTracks().forEach((track) => track.stop());
    }

    streamRef.current = null;
    setStream(null);
    setStatus("idle");
  }, []);

  const toggleMic = useCallback(() => {
    const current = streamRef.current;
    if (!current) return;

    current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setStream(new MediaStream(current.getTracks()));
  }, []);

  const toggleCamera = useCallback(() => {
    const current = streamRef.current;
    if (!current) return;

    current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setStream(new MediaStream(current.getTracks()));
  }, []);

  const isMicEnabled = useMemo(() => {
    if (!stream) return false;
    const track = stream.getAudioTracks()[0];
    return track ? track.enabled : false;
  }, [stream]);

  const isCameraEnabled = useMemo(() => {
    if (!stream) return false;
    const track = stream.getVideoTracks()[0];
    return track ? track.enabled : false;
  }, [stream]);

  useEffect(() => {
    return () => {
      const current = streamRef.current;
      if (current) {
        current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    stream,
    status,
    error,
    isMicEnabled,
    isCameraEnabled,
    requestMedia,
    stopMedia,
    toggleMic,
    toggleCamera,
  };
}