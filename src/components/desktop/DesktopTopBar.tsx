import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Sparkles, 
  Camera, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Layers, 
  Activity, 
  Info,
  ChevronDown
} from 'lucide-react';
import { SceneConfig, CameraPreset, ActivePanel } from '../../types';

interface DesktopTopBarProps {
  activeScene: SceneConfig;
  cameraPreset: CameraPreset;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  activePanel: ActivePanel | null;
  onTogglePanel: (panel: ActivePanel) => void;
  onTakeSnapshot: () => void;
  fps: number;
}

export const DesktopTopBar: React.FC<DesktopTopBarProps> = ({
  activeScene,
  cameraPreset,
  onSelectCameraPreset,
  isAudioPlaying,
  onToggleAudio,
  activePanel,
  onTogglePanel,
  onTakeSnapshot,
  fps
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const menuItems = [
    {
      id: 'file',
      label: 'File',
      options: [
        { label: '📷 Take 4K Snapshot', action: onTakeSnapshot },
        { label: '📊 View Render Stats', action: () => onTogglePanel('stats') }
      ]
    },
    {
      id: 'scenes',
      label: 'Scenes',
      options: [
        { label: '🏙️ Neon Cyberpunk Metropolis', action: () => onTogglePanel('scenes') },
        { label: '🕳️ Quantum Cosmic Black Hole', action: () => onTogglePanel('scenes') },
        { label: '⛩️ Zen Floating Crystal Island', action: () => onTogglePanel('scenes') },
        { label: '🌿 Bioluminescent Alien Forest', action: () => onTogglePanel('scenes') },
        { label: '🧊 Hypercube Quantum Tesseract', action: () => onTogglePanel('scenes') }
      ]
    },
    {
      id: 'camera',
      label: 'Camera',
      options: [
        { label: 'Orbit View', action: () => onSelectCameraPreset('orbit') },
        { label: 'Cinematic Wide', action: () => onSelectCameraPreset('cinematic_wide') },
        { label: 'Isometric Angle', action: () => onSelectCameraPreset('isometric') },
        { label: 'Top-Down View', action: () => onSelectCameraPreset('top_down') },
        { label: 'First-Person Eye', action: () => onSelectCameraPreset('first_person') }
      ]
    },
    {
      id: 'lighting',
      label: 'Shaders & FX',
      options: [
        { label: 'Open Shaders & Lighting Inspector', action: () => onTogglePanel('inspector') },
        { label: 'Particle FX Controller', action: () => onTogglePanel('particles') }
      ]
    },
    {
      id: 'audio',
      label: 'Audio',
      options: [
        { label: isAudioPlaying ? 'Mute Generative Soundscape' : 'Enable 3D Generative Audio', action: onToggleAudio },
        { label: 'Audio Frequency Control Panel', action: () => onTogglePanel('audio') }
      ]
    }
  ];

  return (
    <header className="h-10 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-3 flex items-center justify-between text-xs text-slate-300 z-50 select-none">
      {/* Left: Window Branding & Top OS Dropdown Menus */}
      <div className="flex items-center space-x-3">
        {/* Traffic Light Window Buttons */}
        <div className="flex items-center space-x-1.5 mr-1">
          <div className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors cursor-pointer" title="Close" />
          <div className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 transition-colors cursor-pointer" title="Minimize" />
          <div className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer" title="Maximize" />
        </div>

        {/* Brand Badge */}
        <div className="flex items-center space-x-1.5 font-bold text-cyan-400 tracking-wider pr-2 border-r border-slate-800">
          <Box className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-mono">AETHER 3D v2.5</span>
        </div>

        {/* OS Menu Items */}
        <div className="hidden md:flex items-center space-x-1 relative">
          {menuItems.map((menu) => (
            <div key={menu.id} className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === menu.id ? null : menu.id)}
                className={`px-2.5 py-1 rounded hover:bg-slate-800/80 transition-colors flex items-center space-x-1 ${
                  activeMenu === menu.id ? 'bg-slate-800 text-cyan-300' : 'text-slate-300'
                }`}
              >
                <span>{menu.label}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeMenu === menu.id && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setActiveMenu(null)} 
                  />
                  <div className="absolute left-0 top-full mt-1 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-lg shadow-2xl py-1 z-50">
                    {menu.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          opt.action();
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors text-xs flex items-center justify-between"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center: Active Scene Name & Quick Panel Toggle Buttons */}
      <div className="hidden lg:flex items-center space-x-2 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-medium text-slate-200">{activeScene.title}</span>
        <span className="text-slate-500 text-[10px]">({activeScene.category})</span>
      </div>

      {/* Right: Quick Action Controls & Clock */}
      <div className="flex items-center space-x-2">
        {/* Scene Selector Toggle Button */}
        <button
          onClick={() => onTogglePanel('scenes')}
          className={`p-1.5 rounded-lg border transition-all flex items-center space-x-1 ${
            activePanel === 'scenes'
              ? 'bg-cyan-500/20 border-cyan-500/80 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
          }`}
          title="Switch 3D Scene"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-medium">Scenes</span>
        </button>

        {/* Shaders/Lighting Inspector Button */}
        <button
          onClick={() => onTogglePanel('inspector')}
          className={`p-1.5 rounded-lg border transition-all flex items-center space-x-1 ${
            activePanel === 'inspector'
              ? 'bg-amber-500/20 border-amber-500/80 text-amber-300 shadow-[0_0_12px_rgba(255,179,0,0.3)]'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
          }`}
          title="Lighting & Shaders Inspector"
        >
          <Sun className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-medium">Inspector</span>
        </button>

        {/* Audio Toggle Button */}
        <button
          onClick={onToggleAudio}
          className={`p-1.5 rounded-lg border transition-all flex items-center space-x-1 ${
            isAudioPlaying
              ? 'bg-emerald-500/20 border-emerald-500/80 text-emerald-300 shadow-[0_0_12px_rgba(0,255,150,0.3)]'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
          }`}
          title="Toggle Generative 3D Audio"
        >
          {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline text-[11px] font-medium">{isAudioPlaying ? 'Audio ON' : 'Audio OFF'}</span>
        </button>

        {/* 4K Snapshot Button */}
        <button
          onClick={onTakeSnapshot}
          className="p-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white border border-indigo-400/50 transition-all flex items-center space-x-1 shadow-md active:scale-95"
          title="Take 4K Snapshot"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-medium">Snapshot</span>
        </button>

        {/* FPS Badge */}
        <div className="hidden sm:flex items-center space-x-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono text-[11px]">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span className={fps >= 55 ? 'text-emerald-400' : fps >= 30 ? 'text-amber-400' : 'text-rose-400'}>
            {fps} FPS
          </span>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:bg-slate-800 transition-colors"
          title="Toggle Fullscreen Viewport"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Clock */}
        <div className="font-mono text-slate-400 text-[11px] pl-2 border-l border-slate-800">
          {timeStr || '12:00:00'}
        </div>
      </div>
    </header>
  );
};
