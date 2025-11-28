export interface DetectedObject {
  label: string;
  confidence: number;
  box_2d?: number[]; // [ymin, xmin, ymax, xmax]
}

export interface AnalysisResult {
  objects: DetectedObject[];
  threatLevel: 'DÜŞÜK' | 'ORTA' | 'YÜKSEK' | 'KRİTİK';
  summary: string;
  timestamp: string;
}

export interface SecurityEvent {
  id: string;
  time: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface SystemStatus {
  fps: number;
  activeCameras: number;
  aiModel: string;
  uptime: string;
}