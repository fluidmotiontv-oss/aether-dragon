import React, { useState } from 'react';
import { PerformanceStats } from '../../types';
import { Cpu, Activity, Zap, Layers, ChevronUp, ChevronDown } from 'lucide-react';

interface PerformanceHudProps {
  stats: PerformanceStats;
}

export const PerformanceHud: React.FC<PerformanceHudProps> = ({ stats }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="absolute bottom-4 left-4 z-30 select-none font-mono text-[11px] text-slate-300">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl overflow-hidden min-w-[200px]">
        {/* Header */}
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center space-x-1.5 font-bold text-cyan-400">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>WebGL Telemetry</span>
          </div>
          <button className="text-slate-400 hover:text-slate-200">
            {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expanded Stats Body */}
        {!isCollapsed && (
          <div className="p-3 space-y-2">
            {/* FPS & Latency */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                FPS / Latency
              </span>
              <span className="font-bold text-emerald-400">
                {stats.fps} FPS <span className="text-slate-500 font-normal">({stats.frameTimeMs}ms)</span>
              </span>
            </div>

            {/* Triangles */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyan-400" />
                Triangles
              </span>
              <span className="font-semibold text-slate-200">
                {stats.triangles.toLocaleString()}
              </span>
            </div>

            {/* Draw Calls */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-purple-400" />
                Draw Calls
              </span>
              <span className="font-semibold text-slate-200">
                {stats.drawCalls}
              </span>
            </div>

            {/* GPU Memory Assets */}
            <div className="pt-1.5 border-t border-slate-800/80 flex justify-between text-[10px] text-slate-500">
              <span>Geometries: <strong className="text-slate-300">{stats.geometries}</strong></span>
              <span>Textures: <strong className="text-slate-300">{stats.textures}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
