import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  X, 
  Check, 
  RotateCcw, 
  AlertCircle, 
  Sparkles, 
  Image as ImageIcon,
  ShieldCheck,
  Video
} from 'lucide-react';

export default function CameraCaptureModal({ isOpen, onClose, onCaptureComplete }) {
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [snapshotUrl, setSnapshotUrl] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.warn("Error stopping track:", e);
        }
      });
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    setCameraError('');
    setSnapshotUrl(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser.");
      }

      // Prefer rear camera on mobile / environment facing mode
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' }, 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Camera access failed:", err);
      setCameraError(
        err.name === 'NotAllowedError' 
          ? 'Camera permission denied. Please allow camera access in your browser settings to scan live packages.' 
          : 'No camera device detected or camera is currently in use by another application.'
      );
    }
  }, []);

  // Manage camera lifecycle based on modal open state
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setSnapshotUrl(null);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Handle capture frame
  const handleCapture = () => {
    setIsCapturing(true);
    try {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const width = video.videoWidth || 1280;
        const height = video.videoHeight || 720;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setSnapshotUrl(dataUrl);

        // Pause / stop camera stream once photo is taken
        stopCamera();
      } else {
        // Fallback for simulation when camera is not connected
        setSnapshotUrl('/demo/food/amul_milk.svg');
        stopCamera();
      }
    } catch (err) {
      console.error("Failed to capture frame:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  // Retake photo: clear snapshot and restart live camera
  const handleRetake = () => {
    setSnapshotUrl(null);
    startCamera();
  };

  // Confirm photo: convert to File object and invoke callback
  const handleConfirmAndScan = () => {
    if (!snapshotUrl) return;

    // Convert data URL to File object
    let file;
    if (snapshotUrl.startsWith('data:')) {
      const arr = snapshotUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      file = new File([u8arr], `camera_scan_${Date.now()}.jpg`, { type: mime });
    } else {
      // If external fallback URL, pass simulated object
      file = null;
    }

    // Ensure all tracks are stopped
    stopCamera();

    // Notify parent
    onCaptureComplete([
      {
        angle: 'front',
        url: snapshotUrl,
        file: file
      }
    ]);

    onClose();
  };

  // Close modal and stop camera
  const handleModalClose = () => {
    stopCamera();
    setSnapshotUrl(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {snapshotUrl ? "Review Captured Package Label" : "Scan Label with Camera"}
            </h3>
          </div>
          <button 
            onClick={handleModalClose} 
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition"
            title="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport / Snapshot Preview */}
        <div className="relative bg-slate-950 aspect-4/3 flex items-center justify-center overflow-hidden">
          
          {/* 1. SNAPSHOT PREVIEW STATE */}
          {snapshotUrl ? (
            <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
              <img 
                src={snapshotUrl} 
                alt="Captured Snapshot" 
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Snapshot Captured Ready for Analysis</span>
              </div>
            </div>
          ) : stream ? (
            /* 2. LIVE CAMERA STREAM */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Alignment Crosshairs & Border Guide */}
              <div className="absolute inset-8 border-2 border-dashed border-white/70 rounded-2xl pointer-events-none flex flex-col justify-between p-4 shadow-inner">
                <div className="flex justify-between items-center text-[11px] font-semibold text-white/90 bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs self-center">
                  <span>Align package label inside the frame</span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-white/75 bg-black/40 px-2 py-0.5 rounded self-center">
                  <span>Ensure MRP, MFD, EXP, and Net Quantity are clearly visible</span>
                </div>
              </div>

              <div className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Live Camera
              </div>
            </div>
          ) : (
            /* 3. CAMERA ERROR / NO STREAM FALLBACK */
            <div className="p-8 text-center text-white space-y-3 max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-amber-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-100">Camera Unavailable</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {cameraError || "Requesting camera permission..."}
              </p>
              
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={startCamera}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setSnapshotUrl('/demo/food/amul_milk.svg');
                  }}
                  className="px-4 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition shadow-xs"
                >
                  Load Reference Package Sample
                </button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Modal Controls Bar */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
          {snapshotUrl ? (
            /* Controls after photo is captured: Retake vs Confirm */
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Photo</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmAndScan}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm &amp; Scan Label</span>
              </button>
            </>
          ) : (
            /* Controls while live stream is running: Shutter Button */
            <>
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCapture}
                disabled={!stream}
                className={`px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition flex items-center gap-2 ${
                  stream 
                    ? 'bg-brand-600 hover:bg-brand-700 cursor-pointer active:scale-95' 
                    : 'bg-slate-300 cursor-not-allowed text-slate-500'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Capture Photo</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
