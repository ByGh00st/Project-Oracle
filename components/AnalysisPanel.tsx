import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, ShieldCheck, ShieldAlert, Scan, Activity, Target } from 'lucide-react';

interface AnalysisPanelProps {
  data: AnalysisResult | null;
  isProcessing: boolean;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ data, isProcessing }) => {
  if (!data) {
    return (
      <div className="h-full flex items-center justify-center p-4 border border-dashed border-slate-700 rounded-lg">
        <p className="text-slate-500 font-mono text-sm">YOLOv8 veri akışı bekleniyor...</p>
      </div>
    );
  }

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'DÜŞÜK': return 'text-green-500 border-green-500/30 bg-green-500/10';
      case 'ORTA': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
      case 'YÜKSEK': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
      case 'KRİTİK': return 'text-red-600 border-red-600/30 bg-red-600/10 animate-pulse';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Threat Level Header */}
      <div className={`p-4 rounded-lg border-l-4 flex items-center justify-between ${getThreatColor(data.threatLevel)}`}>
        <div className="flex items-center space-x-3">
          {data.threatLevel === 'KRİTİK' || data.threatLevel === 'YÜKSEK' ? (
            <ShieldAlert className="w-6 h-6" />
          ) : (
            <ShieldCheck className="w-6 h-6" />
          )}
          <div>
            <h3 className="font-bold text-lg tracking-wider">TEHDİT SEVİYESİ</h3>
            <p className="font-mono text-2xl font-black">{data.threatLevel}</p>
          </div>
        </div>
        {isProcessing && <Activity className="w-5 h-5 animate-pulse opacity-70" />}
      </div>

      {/* Detected Objects Grid */}
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
        <h4 className="text-cyan-400 font-mono text-xs mb-3 flex items-center justify-between">
          <span className="flex items-center"><Scan className="w-4 h-4 mr-2" /> YOLOv8 DETECTIONS</span>
          <span className="text-[10px] text-slate-500">COCO DATASET</span>
        </h4>
        <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
          {data.objects.length > 0 ? (
            data.objects.map((obj, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800 text-sm group hover:border-cyan-500/50 transition-colors">
                <div className="flex items-center space-x-2">
                   <Target className="w-3 h-3 text-slate-600 group-hover:text-cyan-400" />
                   <div className="flex flex-col">
                      <span className="text-slate-200 font-medium">{obj.label}</span>
                      {obj.box_2d && (
                        <span className="text-[9px] text-slate-600 font-mono">
                          [{obj.box_2d.map(n => n.toFixed(2)).join(', ')}]
                        </span>
                      )}
                   </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-cyan-500 font-mono text-xs font-bold">{(obj.confidence * 100).toFixed(0)}%</span>
                   <span className="text-[9px] text-slate-600">CONF</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-600 text-xs text-center py-4 italic">Nesne algılanmadı</div>
          )}
        </div>
      </div>

      {/* Summary Text */}
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
        <h4 className="text-cyan-400 font-mono text-xs mb-2 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          DURUM ANALİZİ
        </h4>
        <p className="text-slate-300 text-sm leading-relaxed font-mono">
          {data.summary}
        </p>
        <div className="mt-2 text-right border-t border-slate-800 pt-1">
             <span className="text-slate-500 text-[10px] uppercase">Model: YOLOv8-L / Gemini Hybrid</span>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;