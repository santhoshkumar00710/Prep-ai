import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export async function loadFaceApiModels(): Promise<void> {
  if (modelsLoaded) return;
  const MODEL_URL = '/models';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  ]);
  modelsLoaded = true;
}

export interface FaceDetectionResult {
  expressions: Record<string, number>;
  eyeContactScore: number;
  isLookingAway: boolean;
  faceDetected: boolean;
}

/**
 * Estimate eye contact based on face landmark positions.
 * Uses nose tip vs eye midpoint alignment to detect pitch/yaw.
 */
export function estimateEyeContact(
  landmarks: faceapi.FaceLandmarks68
): { eyeContactScore: number; isLookingAway: boolean } {
  const positions = landmarks.positions;

  // Nose tip = position 30
  const noseTip = positions[30];
  // Left eye center = avg of positions 36-41
  const leftEyePoints = positions.slice(36, 42);
  const rightEyePoints = positions.slice(42, 48);

  const leftEyeCenter = {
    x: leftEyePoints.reduce((s, p) => s + p.x, 0) / 6,
    y: leftEyePoints.reduce((s, p) => s + p.y, 0) / 6,
  };
  const rightEyeCenter = {
    x: rightEyePoints.reduce((s, p) => s + p.x, 0) / 6,
    y: rightEyePoints.reduce((s, p) => s + p.y, 0) / 6,
  };

  const eyeMidX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
  const eyeWidth = Math.abs(rightEyeCenter.x - leftEyeCenter.x);

  // Horizontal deviation of nose from eye midpoint (yaw)
  const horizontalDev = Math.abs(noseTip.x - eyeMidX) / eyeWidth;

  // Score: lower deviation = better eye contact
  const eyeContactScore = Math.max(0, Math.min(100, 100 - horizontalDev * 200));
  const isLookingAway = eyeContactScore < 40;

  return { eyeContactScore: Math.round(eyeContactScore), isLookingAway };
}

export async function detectFace(
  videoEl: HTMLVideoElement | HTMLCanvasElement
): Promise<FaceDetectionResult | null> {
  try {
    const detection = await faceapi
      .detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (!detection) {
      return { expressions: {}, eyeContactScore: 0, isLookingAway: true, faceDetected: false };
    }

    const expressions = detection.expressions as unknown as Record<string, number>;
    const { eyeContactScore, isLookingAway } = estimateEyeContact(detection.landmarks);

    return { expressions, eyeContactScore, isLookingAway, faceDetected: true };
  } catch {
    return null;
  }
}
