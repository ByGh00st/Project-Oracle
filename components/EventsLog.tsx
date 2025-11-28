import React from 'react';
import { SecurityEvent } from '../types';
import { AlertCircle, Info, CheckCircle } from 'lucide-react';

interface EventsLogProps {
  events: SecurityEvent[];
}

const EventsLog: React.FC<EventsLogProps> = ({ events }) => {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-800 flex flex-col h-full overflow-hidden">
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-cyan-400 font-mono text-sm tracking-wider">OLAY GÜNLÜĞÜ</h3>
        <span className="text-xs text-slate-500 font-mono">SON {events.length} KAYIT</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {events.length === 0 ? (
          <div className="text-center py-8 text-slate-600 text-sm font-mono">
            Kayıtlı olay bulunamadı.
          </div>
        ) : (
          events.map((evt) => (
            <div 
              key={evt.id} 
              className={`p-3 rounded border-l-2 flex items-start space-x-3 transition-colors hover:bg-slate-800/50 ${
                evt.severity === 'high' ? 'border-red-500 bg-red-950/10' :
                evt.severity === 'medium' ? 'border-orange-500 bg-orange-950/10' :
                'border-cyan-500 bg-cyan-950/10'
              }`}
            >
              <div className="mt-0.5">
                {evt.severity === 'high' ? <AlertCircle className="w-4 h-4 text-red-500" /> :
                 evt.severity === 'medium' ? <Info className="w-4 h-4 text-orange-500" /> :
                 <CheckCircle className="w-4 h-4 text-cyan-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className={`text-xs font-bold uppercase ${
                    evt.severity === 'high' ? 'text-red-400' : 'text-slate-300'
                  }`}>
                    {evt.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{evt.time}</span>
                </div>
                <p className="text-xs text-slate-400 truncate">{evt.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsLog;