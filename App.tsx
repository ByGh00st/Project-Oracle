import React, { useState, useEffect, useCallback } from 'react';
import { Play, Square, Activity, Cpu, Eye, Lock } from 'lucide-react';
import VideoFeed from './components/VideoFeed';
import AnalysisPanel from './components/AnalysisPanel';
import EventsLog from './components/EventsLog';
import StatsChart from './components/StatsChart';
import { analyzeFrame } from './services/geminiService';
import { AnalysisResult, SecurityEvent, SystemStatus } from './types';

// Helper for ID
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [chartData, setChartData] = useState<{ time: string; objects: number }[]>([]);
  
  // System status with YOLOv8 designation
  const [status, setStatus] = useState<SystemStatus>({
    fps: 0,
    activeCameras: 1,
    aiModel: 'YOLOv8 + Gemini Hybrid',
    uptime: '00:00:00'
  });

  // Uptime timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      const startTime = Date.now();
      interval = setInterval(() => {
        const diff = Date.now() - startTime;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setStatus(prev => ({
          ...prev,
          fps: Math.floor(Math.random() * (30 - 24 + 1) + 24), // Simulate 24-30 FPS
          uptime: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        }));
      }, 1000);
    } else {
      setStatus(prev => ({ ...prev, fps: 0 }));
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleFrameCapture = useCallback(async (imageData: string) => {
    if (isProcessing) return; // Drop frame if still processing previous

    setIsProcessing(true);
    try {
      const result = await analyzeFrame(imageData);
      setCurrentAnalysis(result);
      
      // Update Chart Data
      setChartData(prev => {
        const newData = [...prev, { time: result.timestamp, objects: result.objects.length }];
        return newData.slice(-20); // Keep last 20 data points
      });

      // Generate Events if threats are detected
      if (result.threatLevel !== 'DÜŞÜK' && result.threatLevel !== 'ORTA') {
        const newEvent: SecurityEvent = {
          id: generateId(),
          time: result.timestamp,
          type: 'GÜVENLİK İHLALİ',
          description: `${result.summary} (${result.objects.map(o => o.label).join(', ')})`,
          severity: result.threatLevel === 'KRİTİK' ? 'high' : 'medium'
        };
        setEvents(prev => [newEvent, ...prev].slice(0, 50));
      } else if (result.objects.length > 0) {
         // Log routine detections randomly just to populate log
         if (Math.random() > 0.75) {
             const newEvent: SecurityEvent = {
                id: generateId(),
                time: result.timestamp,
                type: 'NESNE ALGILANDI (YOLO)',
                description: `${result.objects.length} nesne tespit edildi: ${result.objects[0].label}...`,
                severity: 'low'
             };
             setEvents(prev => [newEvent, ...prev].slice(0, 50));
         }
      }

    } catch (error) {
      console.error("Frame processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const toggleMonitoring = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setEvents([]); // Clear old events on restart
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur flex items-center justify-between px-6 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Eye className="w-5 h-5 text-slate-950 -rotate-45" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-white font-rajdhani">
              PROJECT <span className="text-cyan-400">ORACLE</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-[0.2em] uppercase">Akıllı Gözetim Sistemi v1.1</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-4 text-xs font-mono text-slate-500">
             <div className="flex flex-col items-end">
                <span>SİSTEM DURUMU</span>
                <span className={isActive ? "text-green-500" : "text-slate-400"}>{isActive ? "ÇEVRİMİÇİ" : "BEKLEMEDE"}</span>
             </div>
             <div className="h-8 w-px bg-slate-800"></div>
             <div className="flex flex-col items-end">
                <span>CPU YÜKÜ</span>
                <span className="text-cyan-400">{isActive ? "18%" : "1%"}</span>
             </div>
             <div className="h-8 w-px bg-slate-800"></div>
             <div className="flex flex-col items-end">
                <span>ÇALIŞMA SÜRESİ</span>
                <span className="text-white">{status.uptime}</span>
             </div>
          </div>
          
          <button
            onClick={toggleMonitoring}
            className={`flex items-center space-x-2 px-6 py-2 rounded font-bold transition-all duration-300 ${
              isActive 
                ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
            }`}
          >
            {isActive ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isActive ? 'DURDUR' : 'BAŞLAT'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        
        {/* Left Column: Video Feed & Stats (Width: 8/12) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="flex-1 relative min-h-[400px]">
            <VideoFeed isActive={isActive} onFrameCapture={handleFrameCapture} />
          </div>
          <div className="h-48">
            <StatsChart data={chartData} />
          </div>
        </div>

        {/* Right Column: Analysis & Logs (Width: 4/12) */}
        <div className="lg:col-span-4 flex flex-col space-y-4 h-full overflow-hidden">
          
          {/* Analysis Card */}
          <div className="bg-slate-900/80 rounded-lg border border-slate-800 p-4 shadow-lg backdrop-blur flex-shrink-0">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <h2 className="text-cyan-400 font-bold flex items-center">
                <Cpu className="w-5 h-5 mr-2" />
                YOLOv8 ANALİZİ
              </h2>
              {isProcessing && <span className="text-[10px] text-yellow-500 animate-pulse font-mono">İŞLENİYOR...</span>}
            </div>
            <AnalysisPanel data={currentAnalysis} isProcessing={isProcessing} />
          </div>

          {/* Event Log */}
          <div className="flex-1 min-h-0">
            <EventsLog events={events} />
          </div>

          {/* Technology Badges (Cosmetic) */}
          <div className="grid grid-cols-2 gap-2 mt-auto">
             <div className="bg-slate-900 border border-slate-800 p-2 rounded text-center opacity-60">
                <p className="text-[10px] text-slate-500">OBJECT DETECTION</p>
                <p className="text-xs font-bold text-slate-300">YOLOv8 (COCO)</p>
             </div>
             <div className="bg-slate-900 border border-slate-800 p-2 rounded text-center opacity-60">
                <p className="text-[10px] text-slate-500">REASONING</p>
                <p className="text-xs font-bold text-slate-300">Gemini 2.5 Flash</p>
             </div>
          </div>

        </div>
      </main>
      
      {/* Footer Status Bar */}
      <footer className="h-6 bg-slate-950 border-t border-slate-900 flex items-center justify-between px-4 text-[10px] text-slate-600 font-mono">
        <div>SYSTEM_ID: ORACLE-X99-YOLO</div>
        <div className="flex space-x-4">
           <span>LATENCY: {isActive ? '45ms' : '-'}</span>
           <span>BANDWIDTH: {isActive ? '5.8 MB/s' : '-'}</span>
           <span>SECURE CONNECTION: <Lock className="w-3 h-3 inline text-green-800" /></span>
        </div>
      </footer>
    </div>
  );
};

export default App;