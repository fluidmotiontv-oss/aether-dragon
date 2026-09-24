import React, { useState, useCallback } from 'react';
import { CanvasContainer } from './components/3d/CanvasContainer';
import { DesktopTopBar } from './components/desktop/DesktopTopBar';
import { DesktopDock } from './components/desktop/DesktopDock';
import { SceneSelectorPanel } from './components/desktop/SceneSelectorPanel';
import { InspectorPanel } from './components/desktop/InspectorPanel';
import { AudioControlPanel } from './components/desktop/AudioControlPanel';
import { PerformanceHud } from './components/desktop/PerformanceHud';
import { ScreenshotModal } from './components/desktop/ScreenshotModal';
import { SeedanceStudioPanel } from './components/desktop/SeedanceStudioPanel';
import { AiStoryPanel } from './components/desktop/AiStoryPanel';
import { EighteenMinCinemaOverlay } from './components/desktop/EighteenMinCinemaOverlay';

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
  const [sceneId, setSceneId] = useState<SceneId>('cyber_dragon_awakening');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('orbit');
  const [activePanel, setActivePanel] = useState<ActivePanel | null>('seedance_studio');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [master18MinPackage, setMaster18MinPackage] = useState<any | null>(null);

  const [lightingConfig, setLightingConfig] = useState<LightingConfig>({
    dirLightX: 15,
    dirLightY: 30,
    dirLightZ: 20,
    dirLightColor: '#00f0ff',
    dirLightIntensity: 1.8,
    ambientColor: '#ff0055',
    ambientIntensity: 0.8,
    fogDensity: 0.012,
    fogColor: '#02040d',
    wireframe: false,
    shadows: true,
    autoRotate: true,
    autoRotateSpeed: 1.0,
    fov: 55,
    bloomGlow: 1.5,
    chromaticAberration: 0.3,
    particleCount: 20000,
    particleSpeed: 1.2,
    waveAmplitude: 1.0,
    audioReactivity: 1.4
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
      if (sceneId === 'cyber_dragon_awakening') {
        globalAudioSynth.playPreset('dragon_awakening', 0.6);
      } else {
        globalAudioSynth.playPreset('synthwave_pulse', 0.5);
      }
      setIsAudioPlaying(true);
    }
  }, [isAudioPlaying, sceneId]);

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
        case 'cyber_dragon_awakening':
          globalAudioSynth.playPreset('dragon_awakening');
          break;
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

  const handleTriggerDragonAction = useCallback((action: 'awaken' | 'beam' | 'shield' | 'save_world') => {
    // Switch to Cyber Dragon scene if not active
    if (sceneId !== 'cyber_dragon_awakening') {
      handleSelectScene('cyber_dragon_awakening');
    }

    // Boost audio & particle effects dynamically
    if (!isAudioPlaying) {
      globalAudioSynth.playPreset('dragon_awakening', 0.7);
      setIsAudioPlaying(true);
    }

    if (action === 'save_world') {
      setLightingConfig((prev) => ({
        ...prev,
        particleSpeed: 2.5,
        audioReactivity: 2.0,
        dirLightIntensity: 3.0,
        bloomGlow: 2.0
      }));
      setCameraPreset('cinematic_wide');
    } else if (action === 'beam') {
      setLightingConfig((prev) => ({
        ...prev,
        particleSpeed: 1.8,
        audioReactivity: 1.6
      }));
      setCameraPreset('first_person');
    } else {
      setLightingConfig((prev) => ({
        ...prev,
        particleSpeed: 1.2,
        audioReactivity: 1.4
      }));
      setCameraPreset('orbit');
    }
  }, [sceneId, isAudioPlaying, handleSelectScene]);

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

        {/* Seedance 2.5 Pipeline Panel */}
        {activePanel === 'seedance_studio' && (
          <SeedanceStudioPanel
            onClose={() => setActivePanel(null)}
            onTriggerDragonAction={handleTriggerDragonAction}
            onLaunch18MinCinema={setMaster18MinPackage}
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

        {/* AI Story Panel */}
        {activePanel === 'ai_story' && (
          <AiStoryPanel
            onClose={() => setActivePanel(null)}
            onTriggerDragonAction={handleTriggerDragonAction}
            onLaunch18MinCinema={setMaster18MinPackage}
          />
        )}

        {/* 18-Minute Cinema Live Overlay Player */}
        {master18MinPackage && (
          <EighteenMinCinemaOverlay
            masterPackage={master18MinPackage}
            onClose={() => setMaster18MinPackage(null)}
            onTriggerDragonAction={handleTriggerDragonAction}
          />
        )}

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
