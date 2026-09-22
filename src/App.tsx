import React, { useState, useCallback } from 'react';
import { CanvasContainer } from './components/3d/CanvasContainer';
import { DesktopTopBar } from './components/desktop/DesktopTopBar';
import { DesktopDock } from './components/desktop/DesktopDock';
import { SceneSelectorPanel } from './components/desktop/SceneSelectorPanel';
import { InspectorPanel } from './components/desktop/InspectorPanel';
import { AudioControlPanel } from './components/desktop/AudioControlPanel';
import { PerformanceHud } from './components/desktop/PerformanceHud';
import { ScreenshotModal } from './components/desktop/ScreenshotModal';

import { getSceneConfig } from './scenes/sceneData';
import { ThreeSceneManager } from './scenes/threeSceneManager';
import { globalAudioSynth } from './audio/AudioSynthesizer';
import { 
  SceneId, 
  CameraPreset, 
  LightingConfig, 
  PerformanceStats, 
  ActivePanel 
} from './types';

export default function App() {
  const [sceneId, setSceneId] = useState<SceneId>('cyberpunk');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('orbit');
  const [activePanel, setActivePanel] = useState<ActivePanel | null>('scenes');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  const [lightingConfig, setLightingConfig] = useState<LightingConfig>({
    dirLightX: 15,
    dirLightY: 30,
    dirLightZ: 20,
    dirLightColor: '#ffffff',
    dirLightIntensity: 1.5,
    ambientColor: '#12182b',
    ambientIntensity: 0.8,
    fogDensity: 0.018,
    fogColor: '#050714',
    wireframe: false,
    shadows: true,
    autoRotate: true,
    autoRotateSpeed: 1.0,
    fov: 55,
    bloomGlow: 1.2,
    chromaticAberration: 0.2,
    particleCount: 15000,
    particleSpeed: 1.0,
    waveAmplitude: 1.0,
    audioReactivity: 1.2
  });

  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    frameTimeMs: 16.6,
    triangles: 0,
    drawCalls: 0,
    geometries: 0,
    textures: 0
  });

  const [manager, setManager] = useState<ThreeSceneManager | null>(null);

  const activeSceneConfig = getSceneConfig(sceneId);

  const handleUpdateLighting = useCallback((newConfig: Partial<LightingConfig>) => {
    setLightingConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const handleTogglePanel = useCallback((panel: ActivePanel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }, []);

  const handleToggleAudio = useCallback(() => {
    if (isAudioPlaying) {
      globalAudioSynth.stop();
      setIsAudioPlaying(false);
    } else {
      globalAudioSynth.playPreset('synthwave_pulse', 0.5);
      setIsAudioPlaying(true);
    }
  }, [isAudioPlaying]);

  const handleSelectScene = useCallback((newSceneId: SceneId) => {
    setSceneId(newSceneId);
    const config = getSceneConfig(newSceneId);
    setLightingConfig((prev) => ({
      ...prev,
      particleCount: config.defaultParticles,
      dirLightColor: config.primaryColor,
      ambientColor: config.secondaryColor
    }));

    // Auto switch audio preset if audio is on
    if (isAudioPlaying) {
      switch (newSceneId) {
        case 'cyberpunk':
          globalAudioSynth.playPreset('synthwave_pulse');
          break;
        case 'quantum_blackhole':
          globalAudioSynth.playPreset('cosmic_theta');
          break;
        case 'zen_crystal_island':
          globalAudioSynth.playPreset('zen_crystal');
          break;
        case 'tesseract_lattice':
        case 'bioluminescent_forest':
          globalAudioSynth.playPreset('cyber_bass');
          break;
      }
    }
  }, [isAudioPlaying]);

  const handleTakeSnapshot = useCallback(() => {
    if (manager) {
      const dataUrl = manager.captureSnapshot();
      setSnapshotUrl(dataUrl);
    }
  }, [manager]);

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 overflow-hidden font-sans text-slate-100 select-none">
      {/* 1. Desktop Top Bar */}
      <DesktopTopBar
        activeScene={activeSceneConfig}
        cameraPreset={cameraPreset}
        onSelectCameraPreset={setCameraPreset}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        activePanel={activePanel}
        onTogglePanel={handleTogglePanel}
        onTakeSnapshot={handleTakeSnapshot}
        fps={stats.fps}
      />

      {/* 2. Main Desktop Viewport Body */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex">
        {/* Left Floating OS Panel: Scene Selector */}
        {activePanel === 'scenes' && (
          <SceneSelectorPanel
            activeSceneId={sceneId}
            onSelectScene={handleSelectScene}
            onClose={() => setActivePanel(null)}
          />
        )}

        {/* 3D Canvas Viewport */}
        <div className="flex-1 w-full h-full relative">
          <CanvasContainer
            sceneId={sceneId}
            lightingConfig={lightingConfig}
            cameraPreset={cameraPreset}
            onStatsUpdate={setStats}
            onManagerReady={setManager}
          />

          {/* Performance Telemetry HUD */}
          <PerformanceHud stats={stats} />

          {/* Bottom Desktop Dock */}
          <DesktopDock
            activePanel={activePanel}
            onTogglePanel={handleTogglePanel}
            onTakeSnapshot={handleTakeSnapshot}
            isAudioPlaying={isAudioPlaying}
          />
        </div>

        {/* Right Floating OS Panel: Inspector / Audio Controls */}
        {(activePanel === 'inspector' || activePanel === 'camera' || activePanel === 'particles') && (
          <InspectorPanel
            lightingConfig={lightingConfig}
            cameraPreset={cameraPreset}
            onUpdateLighting={handleUpdateLighting}
            onSelectCameraPreset={setCameraPreset}
            onClose={() => setActivePanel(null)}
          />
        )}

        {activePanel === 'audio' && (
          <AudioControlPanel
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleAudio}
            onClose={() => setActivePanel(null)}
          />
        )}
      </main>

      {/* 3. Screenshot Snapshot Modal */}
      <ScreenshotModal
        imageUrl={snapshotUrl}
        activeScene={activeSceneConfig}
        onClose={() => setSnapshotUrl(null)}
      />
    </div>
  );
}
