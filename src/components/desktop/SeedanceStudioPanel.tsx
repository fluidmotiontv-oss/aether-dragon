import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Video, 
  Music, 
  Sliders, 
  Download, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Film, 
  Cpu, 
  Eye, 
  Wand2, 
  X,
  Volume2,
  Image as ImageIcon
} from 'lucide-react';

interface SeedanceStudioPanelProps {
  onClose: () => void;
  onTriggerDragonAction?: (action: 'awaken' | 'beam' | 'shield' | 'save_world') => void;
  onLaunch18MinCinema?: (masterPackage: any) => void;
}

export const SeedanceStudioPanel: React.FC<SeedanceStudioPanelProps> = ({ 
  onClose,
  onTriggerDragonAction,
  onLaunch18MinCinema
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'character_sheet' | 'cdance_config' | 'export'>('pipeline');
  const [refImagesCount, setRefImagesCount] = useState(12);
  const [audioTrackCount, setAudioTrackCount] = useState(4);
  const [targetResolution, setTargetResolution] = useState<'1080p' | '4K'>('4K');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleFetch18MinAndLaunch = async () => {
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
      console.error('Failed to launch 18min cinema:', err);
    }
  };

  const handleRunExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  return (
    <div className="absolute top-14 left-4 z-40 w-96 max-h-[calc(100vh-7rem)] flex flex-col bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-2xl text-slate-100 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-rose-950/80 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-cyan-200 tracking-wide">
              Seedance 2.5 Pipeline
            </h3>
            <p className="text-[10px] text-cyan-400/70 font-mono">
              C Dance • Dragon 9 Cartoon Studio
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

      {/* Tabs */}
      <div className="grid grid-cols-4 bg-slate-950/50 p-1 border-b border-slate-800 text-[11px] font-medium">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`py-1.5 rounded-md flex items-center justify-center gap-1 transition ${
            activeTab === 'pipeline'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3 h-3" />
          Steps
        </button>
        <button
          onClick={() => setActiveTab('character_sheet')}
          className={`py-1.5 rounded-md flex items-center justify-center gap-1 transition ${
            activeTab === 'character_sheet'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-3 h-3" />
          Assets
        </button>
        <button
          onClick={() => setActiveTab('cdance_config')}
          className={`py-1.5 rounded-md flex items-center justify-center gap-1 transition ${
            activeTab === 'cdance_config'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3 h-3" />
          C Dance
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`py-1.5 rounded-md flex items-center justify-center gap-1 transition ${
            activeTab === 'export'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Download className="w-3 h-3" />
          Export
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)] font-sans text-xs">
        {activeTab === 'pipeline' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
              <h4 className="font-semibold text-cyan-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                4-Step Cartoon Animation Pipeline
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Seamlessly incorporate Seedance 2.5 via C Dance to animate the Cyber Dragon 9 saga with native 30s clips and 50 multimodal references.
              </p>
            </div>

            {/* Step 1 */}
            <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 space-y-1">
              <div className="flex items-center justify-between text-cyan-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Step 1: Character Sheets & Asset Locking
                </span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-cyan-400 font-mono">
                  30 Refs
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Establish front, side, and 3-quarter character sheets for Dragon 9 to prevent identity drift.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 space-y-1">
              <div className="flex items-center justify-between text-cyan-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Step 2: Storyboarding & Audio Timing
                </span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-cyan-400 font-mono">
                  30s Clips
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Segment script into 30s native windows with independent audio/dialogue tracks (up to 10 tracks).
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 space-y-1">
              <div className="flex items-center justify-between text-cyan-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Step 3: C Dance Multimodal Engine
                </span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-cyan-400 font-mono">
                  50 Total Refs
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Configure Seedance 2.5 motion, camera trajectory prompts, lighting, and sync timestamps.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 space-y-1">
              <div className="flex items-center justify-between text-cyan-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Step 4: Extension & Pee Dub Export
                </span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-cyan-400 font-mono">
                  4K Upscale
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Extend clips forward/backward to maintain continuity and finalize resolution for delivery.
              </p>
            </div>

            {/* 3D Scene Controls Trigger */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Live 3D Dragon Interactive Triggers:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onTriggerDragonAction?.('awaken')}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 font-medium text-[11px] flex items-center justify-center gap-1 transition"
                >
                  <Wand2 className="w-3 h-3 text-cyan-400" />
                  Awaken Dragon
                </button>
                <button
                  onClick={() => onTriggerDragonAction?.('beam')}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 font-medium text-[11px] flex items-center justify-center gap-1 transition"
                >
                  <Film className="w-3 h-3 text-rose-400" />
                  Cosmic Beam
                </button>
                <button
                  onClick={() => onTriggerDragonAction?.('shield')}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 font-medium text-[11px] flex items-center justify-center gap-1 transition"
                >
                  <Eye className="w-3 h-3 text-emerald-400" />
                  Deploy Shield
                </button>
                <button
                  onClick={() => onTriggerDragonAction?.('save_world')}
                  className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-rose-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-lg shadow-cyan-500/20 hover:brightness-110 transition"
                >
                  <Sparkles className="w-3 h-3" />
                  Save the World!
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'character_sheet' && (
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              Dragon 9 Character Design Sheets
            </h4>
            <p className="text-[11px] text-slate-300">
              Reference images locked for Seedance 2.5 consistency:
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-slate-800 rounded-lg border border-cyan-500/30 p-2 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-xs mb-1">
                  1
                </div>
                <span className="text-[10px] text-cyan-200 font-medium">Front View</span>
                <span className="text-[9px] text-slate-400">Laser Eyes</span>
              </div>
              <div className="aspect-square bg-slate-800 rounded-lg border border-cyan-500/30 p-2 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 font-bold text-xs mb-1">
                  2
                </div>
                <span className="text-[10px] text-rose-200 font-medium">Side Profile</span>
                <span className="text-[9px] text-slate-400">Cyber Wings</span>
              </div>
              <div className="aspect-square bg-slate-800 rounded-lg border border-cyan-500/30 p-2 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold text-xs mb-1">
                  3
                </div>
                <span className="text-[10px] text-emerald-200 font-medium">3/4 Angle</span>
                <span className="text-[9px] text-slate-400">Spine Array</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-300">Reference Tagging Count:</span>
                <span className="text-cyan-300 font-mono font-bold">{refImagesCount} / 30 images</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={refImagesCount}
                onChange={(e) => setRefImagesCount(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === 'cdance_config' && (
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              C Dance Multimodal Settings
            </h4>

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-slate-300 flex justify-between">
                <span>Audio Dialogue Tracks (Pacing Sync):</span>
                <span className="text-cyan-400 font-mono">{audioTrackCount} / 10 tracks</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={audioTrackCount}
                onChange={(e) => setAudioTrackCount(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1.5">
              <span className="text-[11px] font-semibold text-cyan-300 block">
                Camera & Trajectory Prompt:
              </span>
              <p className="text-[10px] font-mono text-cyan-200 bg-slate-950 p-2 rounded border border-cyan-500/20">
                "Low-angle camera orbit sweeping from dragon pedestal upwards as cosmic plasma beam ignites the sky, dramatic cinematic lighting, 4k 60fps"
              </p>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              Production Export & Pee Dub Sync
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Resolution:</label>
                <div className="flex gap-1 bg-slate-950 p-1 rounded border border-slate-800">
                  <button
                    onClick={() => setTargetResolution('1080p')}
                    className={`flex-1 py-1 rounded text-[10px] font-mono ${
                      targetResolution === '1080p' ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    1080p
                  </button>
                  <button
                    onClick={() => setTargetResolution('4K')}
                    className={`flex-1 py-1 rounded text-[10px] font-mono ${
                      targetResolution === '4K' ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    4K
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Aspect Ratio:</label>
                <div className="flex gap-1 bg-slate-950 p-1 rounded border border-slate-800">
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`flex-1 py-1 rounded text-[10px] font-mono ${
                      aspectRatio === '16:9' ? 'bg-rose-500/30 text-rose-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    16:9
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`flex-1 py-1 rounded text-[10px] font-mono ${
                      aspectRatio === '9:16' ? 'bg-rose-500/30 text-rose-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    9:16
                  </button>
                </div>
              </div>
            </div>

            {isExporting ? (
              <div className="space-y-1.5 p-3 rounded-lg bg-slate-800/80 border border-cyan-500/30">
                <div className="flex justify-between text-[11px] text-cyan-300 font-semibold">
                  <span>Exporting Pee Dub Package...</span>
                  <span>{exportProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-rose-500 transition-all duration-200"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleRunExport}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-rose-500 font-bold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  Render & Export Dragon 9 Package
                </button>

                <button
                  onClick={handleFetch18MinAndLaunch}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 font-extrabold text-white shadow-lg shadow-amber-500/20 hover:brightness-110 flex items-center justify-center gap-2 transition"
                >
                  <Film className="w-4 h-4" />
                  Play 18-Min Master Comedy Cinema
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
