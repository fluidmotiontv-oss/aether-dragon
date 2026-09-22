import React from 'react';
import { SCENES } from '../../scenes/sceneData';
import { SceneConfig, SceneId } from '../../types';
import { Sparkles, Layers, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface SceneSelectorPanelProps {
  activeSceneId: SceneId;
  onSelectScene: (sceneId: SceneId) => void;
  onClose: () => void;
}

export const SceneSelectorPanel: React.FC<SceneSelectorPanelProps> = ({
  activeSceneId,
  onSelectScene,
  onClose
}) => {
  return (
    <div className="w-80 sm:w-96 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 flex flex-col h-full z-40 select-none shadow-2xl">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              3D Scene Gallery
            </h2>
            <p className="text-[11px] text-slate-400">Select a real-time WebGL environment</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scene List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {SCENES.map((scene: SceneConfig) => {
          const isSelected = scene.id === activeSceneId;

          return (
            <div
              key={scene.id}
              onClick={() => onSelectScene(scene.id)}
              className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500/80 shadow-[0_0_20px_rgba(0,240,255,0.25)] ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700/80'
              }`}
            >
              {/* Active Glow Ribbon */}
              {isSelected && (
                <div 
                  className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full" 
                  style={{ backgroundColor: scene.primaryColor }}
                />
              )}

              <div className="pl-1 space-y-2">
                {/* Title & Category */}
                <div className="flex items-start justify-between">
                  <div>
                    <span 
                      className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border mb-1 inline-block"
                      style={{ 
                        color: scene.primaryColor, 
                        borderColor: `${scene.primaryColor}40`,
                        backgroundColor: `${scene.primaryColor}15`
                      }}
                    >
                      {scene.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      {scene.title}
                    </h3>
                  </div>

                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0 mt-1" />
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {scene.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {scene.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Particle Count Footer */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Particles
                  </span>
                  <span className="text-slate-300 font-semibold">
                    {scene.defaultParticles.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 text-[11px] text-slate-400 text-center font-mono">
        Click any scene to load high-res 60 FPS WebGL view
      </div>
    </div>
  );
};
