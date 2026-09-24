import React from 'react';
import { ActivePanel, CameraPreset } from '../../types';
import { 
  Box,
  Layers, 
  Sun, 
  Sparkles, 
  Radio, 
  Compass, 
  Activity, 
  Camera,
  Maximize2
} from 'lucide-react';

interface DesktopDockProps {
  activePanel: ActivePanel | null;
  onTogglePanel: (panel: ActivePanel) => void;
  onTakeSnapshot: () => void;
  isAudioPlaying: boolean;
}

export const DesktopDock: React.FC<DesktopDockProps> = ({
  activePanel,
  onTogglePanel,
  onTakeSnapshot,
  isAudioPlaying
}) => {
  const dockItems: { id: ActivePanel; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'seedance_studio', label: 'Seedance 2.5 Pipeline', icon: <Box className="w-5 h-5 text-cyan-400" /> },
    { id: 'ai_story', label: 'AI Story Script', icon: <Sparkles className="w-5 h-5 text-rose-400" /> },
    { id: 'scenes', label: 'Scene Gallery', icon: <Layers className="w-5 h-5" /> },
    { id: 'inspector', label: 'Shaders & Light', icon: <Sun className="w-5 h-5" /> },
    { id: 'particles', label: 'Particle FX', icon: <Sparkles className="w-5 h-5 text-amber-400" /> },
    { id: 'audio', label: 'Audio Engine', icon: <Radio className={`w-5 h-5 ${isAudioPlaying ? 'text-emerald-400 animate-pulse' : ''}`} /> },
    { id: 'camera', label: 'Camera Presets', icon: <Compass className="w-5 h-5" /> },
    { id: 'stats', label: 'GPU Telemetry', icon: <Activity className="w-5 h-5 text-cyan-400" /> }
  ];

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 select-none hidden sm:block">
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800/90 rounded-2xl p-2 flex items-center space-x-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        {dockItems.map((item) => {
          const isActive = activePanel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTogglePanel(item.id)}
              className={`group relative p-2.5 rounded-xl border transition-all flex flex-col items-center justify-center ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-500/80 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] -translate-y-1'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 hover:-translate-y-0.5'
              }`}
            >
              {item.icon}

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2.5 px-2.5 py-1 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-lg text-[10px] font-mono font-medium text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                {item.label}
              </div>

              {/* Active Indicator Dot */}
              {isActive && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
              )}
            </button>
          );
        })}

        <div className="w-px h-6 bg-slate-800 mx-1" />

        {/* Snapshot Button */}
        <button
          onClick={onTakeSnapshot}
          className="group relative p-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white border border-indigo-400/50 transition-all flex items-center justify-center shadow-lg active:scale-95 hover:-translate-y-0.5"
        >
          <Camera className="w-5 h-5" />
          <div className="absolute bottom-full mb-2.5 px-2.5 py-1 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-lg text-[10px] font-mono font-medium text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            4K Snapshot
          </div>
        </button>
      </div>
    </div>
  );
};
