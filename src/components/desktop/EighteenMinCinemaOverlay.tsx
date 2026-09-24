import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, Volume2, Film, Download, Sparkles, X, Check, Tv, Maximize2 } from 'lucide-react';
import { globalAudioSynth } from '../../audio/AudioSynthesizer';

interface ActScene {
  clipId: number;
  timecode: string;
  title: string;
  dialogue: string;
  cameraPrompt: string;
  action: string;
  sfx: string;
}

interface ActData {
  actNumber: number;
  title: string;
  scenes: ActScene[];
}

interface Master18MinPackage {
  title: string;
  duration: string;
  format: string;
  resolution: string;
  logline: string;
  acts: ActData[];
}

interface EighteenMinCinemaOverlayProps {
  masterPackage: Master18MinPackage;
  onClose: () => void;
  onTriggerDragonAction?: (action: 'awaken' | 'beam' | 'shield' | 'save_world') => void;
}

export const EighteenMinCinemaOverlay: React.FC<EighteenMinCinemaOverlayProps> = ({
  masterPackage,
  onClose,
  onTriggerDragonAction,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentActIdx, setCurrentActIdx] = useState(0);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const currentAct = masterPackage.acts[currentActIdx];
  const currentScene = currentAct?.scenes[currentSceneIdx];

  // Auto playback timer across 18 minutes (speed accelerated by 6x in demo for smooth viewing, or 1:1)
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => {
          const nextSec = prev + 1;
          if (nextSec >= 1080) {
            setIsPlaying(false);
            return 1080;
          }
          // Compute act and scene based on 30s intervals (36 scenes x 30s = 1080s)
          const newSceneGlobalIdx = Math.floor(nextSec / 30);
          const actIdx = Math.floor(newSceneGlobalIdx / 6);
          const sceneIdx = newSceneGlobalIdx % 6;

          if (actIdx < masterPackage.acts.length) {
            setCurrentActIdx(actIdx);
            setCurrentSceneIdx(sceneIdx);
          }

          // Trigger dynamic sound effects based on comedy scene
          if (nextSec % 30 === 1) {
            globalAudioSynth.playRimshot();
            onTriggerDragonAction?.(actIdx % 2 === 0 ? 'awaken' : 'beam');
          }

          return nextSec;
        });
      }, 500); // 1 sec = 500ms for fast previewing
    }
    return () => clearInterval(timer);
  }, [isPlaying, masterPackage, onTriggerDragonAction]);

  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownloadPackage = () => {
    setIsExporting(true);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);

          // Download JSON manifest
          const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(masterPackage, null, 2));
          const downloadAnchor = document.createElement('a');
          downloadAnchor.setAttribute('href', dataStr);
          downloadAnchor.setAttribute('download', 'Dragon9_18Min_Comedy_Master_Seedance2.5.json');
          document.body.appendChild(downloadAnchor);
          downloadAnchor.click();
          downloadAnchor.remove();

          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-between p-6">
      {/* Top Header Cinema HUD */}
      <div className="pointer-events-auto self-start max-w-xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 rounded-xl p-4 shadow-2xl text-slate-100 space-y-2">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-bold text-cyan-300 font-mono tracking-wider uppercase">
              18-Min Live Cinema Stream • {masterPackage.resolution}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <h2 className="text-sm font-extrabold text-cyan-200">
            {masterPackage.title}
          </h2>
          <p className="text-[11px] text-slate-300 font-mono">
            {currentAct?.title}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-cyan-400">
            <span>{formatTimecode(elapsedSeconds)}</span>
            <span>18:00 (1080s)</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-rose-500 to-amber-400 transition-all duration-300"
              style={{ width: `${(elapsedSeconds / 1080) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Subtitle & Comedy Dialogue Overlay */}
      {currentScene && (
        <div className="pointer-events-auto self-center max-w-2xl w-full bg-slate-950/95 backdrop-blur-md border border-rose-500/40 rounded-2xl p-5 shadow-2xl text-center space-y-3 mb-16">
          <div className="flex justify-between items-center text-[10px] font-mono text-rose-400 border-b border-rose-500/20 pb-1.5">
            <span className="flex items-center gap-1.5 font-bold">
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              Scene #{currentScene.clipId}: {currentScene.title}
            </span>
            <span className="text-amber-400">🔊 {currentScene.sfx}</span>
          </div>

          <div className="space-y-1">
            <p className="text-base font-extrabold text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide">
              "{currentScene.dialogue}"
            </p>
            <p className="text-xs text-slate-300 italic">
              Action: {currentScene.action}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 font-mono font-bold flex items-center gap-1 border border-cyan-500/40 transition"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <button
                onClick={() => globalAudioSynth.playRimshot()}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-mono text-[10px] border border-rose-500/40 transition"
              >
                🥁 Rimshot SFX
              </button>

              <button
                onClick={() => globalAudioSynth.playDragonBelch()}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 font-mono text-[10px] border border-emerald-500/40 transition"
              >
                🐲 Plasma Belch
              </button>
            </div>

            {isExporting ? (
              <div className="flex items-center gap-2 text-cyan-300 font-mono text-[10px]">
                <span>Exporting 18m Package... {downloadProgress}%</span>
              </div>
            ) : (
              <button
                onClick={handleDownloadPackage}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-rose-500 hover:brightness-110 font-bold text-white shadow-lg flex items-center gap-1.5 transition text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Export 18m MP4 Manifest
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
