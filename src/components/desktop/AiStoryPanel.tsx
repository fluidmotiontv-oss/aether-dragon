import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, X, Play, BookOpen, Film, Clapperboard, Check } from 'lucide-react';

interface SceneScriptItem {
  step: number;
  title: string;
  cameraPrompt: string;
  action: string;
  audioSyncTrack: string;
}

interface GeneratedScriptData {
  title: string;
  logline: string;
  scenes: SceneScriptItem[];
}

interface AiStoryPanelProps {
  onClose: () => void;
  onTriggerDragonAction?: (action: 'awaken' | 'beam' | 'shield' | 'save_world') => void;
  onLaunch18MinCinema?: (masterPackage: any) => void;
}

export const AiStoryPanel: React.FC<AiStoryPanelProps> = ({ onClose, onTriggerDragonAction, onLaunch18MinCinema }) => {
  const [prompt, setPrompt] = useState('Cyber dragon wakes and saves the world');
  const [episodeType, setEpisodeType] = useState('Action Sci-Fi Climax');
  const [isLoading, setIsLoading] = useState(false);
  const [is18MinLoading, setIs18MinLoading] = useState(false);
  const [scriptData, setScriptData] = useState<GeneratedScriptData | null>(null);
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);

  const handleGenerateScript = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dragon/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, episodeType, durationSeconds: 30 }),
      });
      const data = await res.json();
      if (data.success && data.script) {
        setScriptData(data.script);
        setActiveSceneIdx(0);
      }
    } catch (err) {
      console.error('Failed to generate script:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate18MinComedy = async () => {
    setIs18MinLoading(true);
    try {
      const res = await fetch('/api/dragon/generate-18min-comedy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success && data.masterPackage) {
        onLaunch18MinCinema?.(data.masterPackage);
      }
    } catch (err) {
      console.error('Failed to generate 18min comedy:', err);
    } finally {
      setIs18MinLoading(false);
    }
  };

  return (
    <div className="absolute top-14 right-4 z-40 w-96 max-h-[calc(100vh-7rem)] flex flex-col bg-slate-900/95 backdrop-blur-md border border-rose-500/30 rounded-xl shadow-2xl text-slate-100 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-rose-950/80 via-slate-900 to-cyan-950/80 border-b border-rose-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-200 tracking-wide">
              AI Story Chronicle Generator
            </h3>
            <p className="text-[10px] text-rose-400/70 font-mono">
              Gemini AI • Seedance 2.5 Scripting
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)] font-sans text-xs">
        {/* Input Form */}
        <div className="space-y-2.5">
          <div>
            <label className="text-[11px] font-semibold text-rose-300 block mb-1">
              Episode Premise & Prompt:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500/60 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500 outline-none resize-none font-mono"
              placeholder="e.g. Cyber dragon wakes and saves the world..."
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                Genre / Tone:
              </label>
              <select
                value={episodeType}
                onChange={(e) => setEpisodeType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none font-mono"
              >
                <option value="Action Sci-Fi Climax">Action Sci-Fi Climax</option>
                <option value="Epic Awakened Origin">Epic Awakened Origin</option>
                <option value="Cosmic Salvation Arc">Cosmic Salvation Arc</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerateScript}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-cyan-500 hover:brightness-110 font-bold text-white text-xs flex items-center gap-1.5 shadow-lg shadow-rose-500/20 disabled:opacity-50 transition h-[34px]"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5" />
                )}
                Generate
              </button>
            </div>
          </div>

          {/* 18-Minute Comedy Master Special Launcher */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={handleGenerate18MinComedy}
              disabled={is18MinLoading}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 hover:brightness-110 font-extrabold text-white text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
            >
              {is18MinLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Film className="w-3.5 h-3.5" />
              )}
              🎬 Generate & Play 18-Min Master Comedy MP4
            </button>
          </div>
        </div>

        {/* Display Script Result */}
        {scriptData && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-rose-500/30">
              <span className="text-[10px] text-rose-400 font-mono block mb-0.5">
                GENERATED SCRIPT TITLE
              </span>
              <h4 className="font-bold text-rose-200 text-sm leading-tight mb-1">
                {scriptData.title}
              </h4>
              <p className="text-[11px] text-slate-300 italic leading-snug">
                "{scriptData.logline}"
              </p>
            </div>

            {/* Scenes Carousel */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span className="flex items-center gap-1">
                  <Clapperboard className="w-3.5 h-3.5 text-cyan-400" />
                  Scenes Breakdown ({scriptData.scenes.length}):
                </span>
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1">
                {scriptData.scenes.map((scene, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSceneIdx(idx)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono whitespace-nowrap transition ${
                      activeSceneIdx === idx
                        ? 'bg-rose-500/30 text-rose-300 font-bold border border-rose-500/50'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Step {scene.step}
                  </button>
                ))}
              </div>

              {/* Active Scene Detail */}
              {scriptData.scenes[activeSceneIdx] && (
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cyan-300 text-xs">
                      {scriptData.scenes[activeSceneIdx].title}
                    </span>
                    <button
                      onClick={() => onTriggerDragonAction?.('save_world')}
                      className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-[10px] font-mono border border-rose-500/40 flex items-center gap-1 transition"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      Preview 3D
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 block">
                      Seedance 2.5 Camera Prompt:
                    </span>
                    <p className="text-[11px] font-mono text-cyan-200 bg-slate-950 p-2 rounded border border-cyan-500/20 leading-relaxed">
                      {scriptData.scenes[activeSceneIdx].cameraPrompt}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 block">
                      Dragon Action:
                    </span>
                    <p className="text-[11px] text-slate-200 leading-snug">
                      {scriptData.scenes[activeSceneIdx].action}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 block">
                      Audio Sync Track:
                    </span>
                    <p className="text-[10px] text-rose-300 font-mono bg-slate-900/60 px-2 py-1 rounded">
                      🎵 {scriptData.scenes[activeSceneIdx].audioSyncTrack}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
