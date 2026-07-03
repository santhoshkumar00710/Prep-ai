'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { loadFaceApiModels, detectFace, FaceDetectionResult } from '@/lib/faceapi';

interface WebcamFeedProps {
  isRecording: boolean;
  onFaceDetection: (result: FaceDetectionResult | null) => void;
  className?: string;
}

export function WebcamFeed({ isRecording, onFaceDetection, className = '' }: WebcamFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modelsLoadedRef = useRef(false);

  const startStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Load face-api models once
      if (!modelsLoadedRef.current) {
        await loadFaceApiModels();
        modelsLoadedRef.current = true;
      }
    } catch (err) {
      console.error('Webcam access error:', err);
    }
  }, []);

  const stopStream = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  // Start webcam on mount
  useEffect(() => {
    startStream();
    return () => stopStream();
  }, [startStream, stopStream]);

  // Run face detection when recording
  useEffect(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    if (isRecording && videoRef.current) {
      detectionIntervalRef.current = setInterval(async () => {
        if (videoRef.current && modelsLoadedRef.current) {
          const result = await detectFace(videoRef.current);
          onFaceDetection(result);
        }
      }, 1500); // Every 1.5s to avoid CPU overload
    }

    return () => {
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    };
  }, [isRecording, onFaceDetection]);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[var(--bg-elevated)] ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover scale-x-[-1]"
      />

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-xs font-medium text-white">REC</span>
        </div>
      )}

      {/* No camera overlay */}
      {!streamRef.current && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--bg-elevated)]">
          <AlertCircle className="text-[var(--text-muted)]" size={32} />
          <p className="text-sm text-[var(--text-secondary)]">Camera not available</p>
          <p className="text-xs text-[var(--text-muted)]">Allow camera access to continue</p>
        </div>
      )}
    </div>
  );
}
