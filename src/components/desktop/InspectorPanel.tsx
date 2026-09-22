import React, { useState } from 'react';
import { LightingConfig, CameraPreset, ActivePanel } from '../../types';
import { 
  Sun, 
  Camera, 
  Sparkles, 
  Eye, 
  Sliders, 
  RotateCw, 
  X, 
  Grid, 
  CloudFog, 
  Zap, 
  Palette,
  Compass
} from 'lucide-react';

interface InspectorPanelProps {
  lightingConfig: LightingConfig;
  cameraPreset: CameraPreset;
  onUpdateLighting: (newConfig: Partial<LightingConfig>) => void;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  onClose: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  lightingConfig,
  cameraPreset,
  onUpdateLighting,
  onSelectCameraPreset,
  onClose
}) => {
  const [tab, setTab] = useState<'camera' | 'lighting' | 'particles'>('camera');

  const cameraPresetsList: { id: CameraPreset; label: string; desc: string }[] = [
    { id: 'orbit', label: 'Orbit Perspective', desc: 'Standard 3D interactive camera' },
    { id: 'cinematic_wide', label: 'Cinematic Wide', desc: 'Expansive wide-angle landscape framing' },
    { id: 'isometric', label: 'Isometric Angle', desc: '45-degree orthographic-style projection' },
    { id: 'top_down', label: 'Top-Down Grid', desc: 'Bird-eye strategic overhead view' },
    { id: 'first_person', label: 'First Person Eye', desc: 'Ground-level immersive spectator position' }
  ];

  return (
    <div className="w-80 sm:w-96 bg-slate-900/90 backdrop-blur-xl border-l border-slate-800 flex flex-col h-full z-40 select-none shadow-2xl">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">
              3D Inspector & Shaders
            </h2>
            <p className="text-[11px] text-slate-400">Camera, Lighting & FX controls</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Internal Tabs */}
      <div className="flex border-b border-slate-800/80 bg-slate-950/40 p-1.5 gap-1">
        <button
          onClick={() => setTab('camera')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            tab === 'camera'
              ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          Camera
        </button>

        <button
          onClick={() => setTab('lighting')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            tab === 'lighting'
              ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          Lighting
        </button>

        <button
          onClick={() => setTab('particles')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            tab === 'particles'
              ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Particles
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
        {/* ================= TAB 1: CAMERA ================= */}
        {tab === 'camera' && (
          <div className="space-y-4">
            <div>
              <label className="text-slate-300 font-semibold mb-2 block flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                Camera Angle Presets
              </label>
              <div className="space-y-2">
                {cameraPresetsList.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onSelectCameraPreset(preset.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      cameraPreset === preset.id
                        ? 'bg-amber-500/15 border-amber-500/70 text-amber-300 font-semibold shadow-[0_0_12px_rgba(255,179,0,0.15)]'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="font-bold text-xs">{preset.label}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{preset.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Rotation Toggle */}
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                  Turntable Auto-Rotate
                </span>
                <input
                  type="checkbox"
                  checked={lightingConfig.autoRotate}
                  onChange={(e) => onUpdateLighting({ autoRotate: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
                />
              </div>

              {lightingConfig.autoRotate && (
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Rotation Speed</span>
                    <span className="font-mono text-amber-400">{lightingConfig.autoRotateSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.5"
                    value={lightingConfig.autoRotateSpeed}
                    onChange={(e) => onUpdateLighting({ autoRotateSpeed: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Field of View FOV Slider */}
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between text-slate-200 font-semibold">
                <span>Field of View (FOV)</span>
                <span className="font-mono text-amber-400">{lightingConfig.fov}°</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                step="2"
                value={lightingConfig.fov}
                onChange={(e) => onUpdateLighting({ fov: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ================= TAB 2: LIGHTING & ENVIRONMENT ================= */}
        {tab === 'lighting' && (
          <div className="space-y-4">
            {/* Directional Light Angles */}
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-slate-200 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Directional Sun Light
                </span>
                <span className="font-mono text-amber-400">{lightingConfig.dirLightIntensity.toFixed(1)}x</span>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Sun Intensity</span>
                <input
                  type="range"
                  min="0"
                  max="3.0"
                  step="0.2"
                  value={lightingConfig.dirLightIntensity}
                  onChange={(e) => onUpdateLighting({ dirLightIntensity: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Light Color Pickers */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 text-[11px] block mb-1">Sun Color</span>
                  <input
                    type="color"
                    value={lightingConfig.dirLightColor}
                    onChange={(e) => onUpdateLighting({ dirLightColor: e.target.value })}
                    className="w-full h-8 rounded border border-slate-700 bg-slate-900 cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block mb-1">Ambient Color</span>
                  <input
                    type="color"
                    value={lightingConfig.ambientColor}
                    onChange={(e) => onUpdateLighting({ ambientColor: e.target.value })}
                    className="w-full h-8 rounded border border-slate-700 bg-slate-900 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Fog Density */}
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between text-slate-200 font-semibold items-center">
                <span className="flex items-center gap-1.5">
                  <CloudFog className="w-3.5 h-3.5 text-cyan-400" />
                  Volumetric Fog Density
                </span>
                <span className="font-mono text-cyan-400">{(lightingConfig.fogDensity * 1000).toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.04"
                step="0.002"
                value={lightingConfig.fogDensity}
                onChange={(e) => onUpdateLighting({ fogDensity: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Wireframe & Shadows Toggles */}
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between py-1">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Grid className="w-3.5 h-3.5 text-emerald-400" />
                  Wireframe Shader Mode
                </span>
                <input
                  type="checkbox"
                  checked={lightingConfig.wireframe}
                  onChange={(e) => onUpdateLighting({ wireframe: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PARTICLES & AUDIO REACTIVITY ================= */}
        {tab === 'particles' && (
          <div className="space-y-4">
            {/* Particle Count */}
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between text-slate-200 font-semibold items-center">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Particle Density
                </span>
                <span className="font-mono text-amber-400">{lightingConfig.particleCount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="40000"
                step="2500"
                value={lightingConfig.particleCount}
                onChange={(e) => onUpdateLighting({ particleCount: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Particle Speed */}
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between text-slate-200 font-semibold items-center">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Drift Velocity
                </span>
                <span className="font-mono text-cyan-400">{lightingConfig.particleSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.2"
                value={lightingConfig.particleSpeed}
                onChange={(e) => onUpdateLighting({ particleSpeed: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Audio Reactivity Multiplier */}
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between text-slate-200 font-semibold items-center">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  Audio Beat Reactivity
                </span>
                <span className="font-mono text-purple-400">{lightingConfig.audioReactivity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="3.0"
                step="0.2"
                value={lightingConfig.audioReactivity}
                onChange={(e) => onUpdateLighting({ audioReactivity: parseFloat(e.target.value) })}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
