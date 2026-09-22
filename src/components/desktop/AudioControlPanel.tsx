import React, { useState, useEffect } from 'react';
import { globalAudioSynth } from '../../audio/AudioSynthesizer';
import { AudioPreset } from '../../types';
import { Volume2, VolumeX, Radio, Music, X, Disc } from 'lucide-react';

interface AudioControlPanelProps {
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onClose: () => void;
}

export const AudioControlPanel: React.FC<AudioControlPanelProps> = ({
  isAudioPlaying,
  onToggleAudio,
  onClose
}) => {
  const [currentPreset, setCurrentPreset] = useState<AudioPreset>(globalAudioSynth.getCurrentPreset());
  const [volume, setVolumeState] = useState(0.5);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(16));

  useEffect(() => {
    const interval = setInterval(() => {
      const data = globalAudioSynth.getFrequencyData();
      // sample 16 bins for spectrum visualizer
      const sampled = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        sampled[i] = data[i * 2] || 0;
      }
      setFrequencyData(sampled);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleSelectPreset = (preset: AudioPreset) => {
    setCurrentPreset(preset);
    globalAudioSynth.playPreset(preset, volume);
  };

  const handleVolumeChange = (v: number) => {
    setVolumeState(v);
    globalAudioSynth.setVolume(v);
  };

  const audioPresets: { id: AudioPreset; title: string; desc: string; icon: string }[] = [
    { id: 'synthwave_pulse', title: 'Cyberpunk Synthwave', desc: 'Arpeggiated A-Major 7th synth + 110Hz sub-bass', icon: '🏙️' },
    { id: 'cosmic_theta', title: 'Cosmic 432Hz Theta', desc: '432 Hz pure carrier + 4 Hz binaural focus beat', icon: '🕳️' },
    { id: 'zen_crystal', title: 'Zen Crystal Chimes', desc: 'Solfeggio 528 Hz pentatonic crystal resonance', icon: '⛩️' },
    { id: 'cyber_bass', title: 'Hypercube Sub Bass', desc: '55 Hz sub-bass drone with 2 Hz LFO wobble', icon: '🧊' }
  ];

  return (
    <div className="w-80 sm:w-96 bg-slate-900/90 backdrop-blur-xl border-l border-slate-800 flex flex-col h-full z-40 select-none shadow-2xl">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">
              Generative 3D Audio
            </h2>
            <p className="text-[11px] text-slate-400">Web Audio API Soundscapes & Analyzer</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Real-time Frequency Spectrum Visualizer Bar Chart */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <Disc className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              Live Spectrum Analyzer
            </span>
            <span className="text-[11px] font-mono text-slate-400">64 Bins • 44.1 kHz</span>
          </div>

          <div className="h-16 flex items-end justify-between gap-1 bg-slate-900/90 p-2 rounded-lg border border-slate-800">
            {Array.from(frequencyData).map((val, i) => {
              const heightPct = isAudioPlaying ? Math.max(8, (val / 255) * 100) : 8;
              return (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-emerald-600 via-cyan-500 to-amber-400 rounded-t transition-all duration-75"
                  style={{ height: `${heightPct}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* Master Power & Volume */}
        <div className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              {isAudioPlaying ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              Master Audio Engine
            </span>
            <button
              onClick={onToggleAudio}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                isAudioPlaying
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isAudioPlaying ? 'Mute' : 'Enable Audio'}
            </button>
          </div>

          {/* Volume Slider */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Master Volume</span>
              <span className="font-mono text-emerald-400">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Soundscape Presets */}
        <div className="space-y-2">
          <label className="text-xs text-slate-300 font-semibold block flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-cyan-400" />
            Generative Soundscape Presets
          </label>

          <div className="space-y-2">
            {audioPresets.map((preset) => {
              const isSelected = isAudioPlaying && currentPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/80 text-emerald-300 shadow-[0_0_15px_rgba(0,255,150,0.2)]'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs flex items-center gap-2">
                      <span>{preset.icon}</span>
                      <span>{preset.title}</span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/40 animate-pulse">
                        PLAYING
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-normal">{preset.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
