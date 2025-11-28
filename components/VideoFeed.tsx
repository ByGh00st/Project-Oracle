import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, RefreshCw, Lock, AlertTriangle } from 'lucide-react';

interface VideoFeedProps {
  isActive: boolean;
  onFrameCapture: (imageData: string) => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ isActive, onFrameCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setStreamError(null);
    try {
      // Stop existing stream if any
      stopCamera();

      let stream: MediaStream;
      try {
        // Attempt 1: Try to get the rear camera (environment) with HD resolution
        // This often fails on laptops or desktops without a rear camera
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
      } catch (firstError) {
        console.warn("Primary camera constraints failed, attempting fallback...", firstError);
        // Attempt 2: Fallback to any available video source
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
      }
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      let errorMessage = "Kamera başlatılamadı.";
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = "Kamera erişimi reddedildi. Lütfen tarayıcı ayarlarından izin verin.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = "Kamera cihazı bulunamadı.";
      } else if (err.name === 'NotReadableError') {
        errorMessage = "Kamera şu anda başka bir uygulama tarafından kullanılıyor.";
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = "İstenen kamera özellikleri bu cihazda mevcut değil.";
      } else {
        errorMessage = `Hata: ${err.message || 'Bilinmeyen hata'}`;
      }
      
      setStreamError(errorMessage);
    }
  }, [stopCamera]);

  // Effect 1: Manage Camera Stream lifecycle
  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
      setStreamError(null);
    }

    return () => {
      stopCamera();
    };
  }, [isActive, startCamera, stopCamera]);

  // Effect 2: Capture Frames
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive && !streamError) {
      intervalId = setInterval(() => {
        if (videoRef.current && canvasRef.current && !streamError) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imageData = canvas.toDataURL('image/jpeg', 0.7);
              onFrameCapture(imageData);
            }
          }
        }
      }, 3000); 
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive, streamError, onFrameCapture]);

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden rounded-lg border-2 border-slate-800 shadow-[0_0_20px_rgba(8,145,178,0.2)]">
      {/* HUD Corners */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500 z-10 pointer-events-none"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500 z-10 pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-500 z-10 pointer-events-none"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500 z-10 pointer-events-none"></div>

      {/* Video Element */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className={`w-full h-full object-cover transition-opacity duration-500 ${!isActive ? 'opacity-20' : 'opacity-100'}`}
      />
      
      {/* Hidden Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay Status */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-slate-950/80 px-4 py-1 rounded border border-cyan-900/50 backdrop-blur-sm z-10">
         <span className={`font-mono text-sm ${isActive ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
           {isActive ? '● REC / CANLI AKIŞ' : 'BEKLEMEDE'}
         </span>
      </div>

      {/* Error Message & Permission Request */}
      {streamError && isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 z-20 p-6 backdrop-blur-sm">
          <div className="text-center max-w-sm border border-red-900/50 bg-slate-900 p-6 rounded-lg shadow-2xl">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/50">
               <Lock className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2 font-rajdhani tracking-wider">KAMERA ERİŞİMİ GEREKLİ</h3>
            <p className="text-red-400 font-mono mb-6 text-xs leading-relaxed">{streamError}</p>
            
            <button 
              onClick={startCamera}
              className="group relative inline-flex items-center justify-center px-6 py-2 bg-red-900/30 text-red-400 border border-red-800 hover:bg-red-900/50 hover:text-red-300 transition-all duration-300 rounded font-mono text-sm uppercase tracking-wider"
            >
              <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              <span>Tekrar Dene</span>
            </button>
          </div>
        </div>
      )}

      {/* Placeholder / Inactive State */}
      {!isActive && !streamError && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
             <div className="w-20 h-20 mx-auto mb-4 border-2 border-slate-700 rounded-full flex items-center justify-center relative">
               <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin-slow"></div>
               <Camera className="w-8 h-8 text-slate-600" />
             </div>
             <p className="text-cyan-800 font-mono text-xl tracking-widest animate-pulse">SİSTEM BAŞLATILIYOR...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;