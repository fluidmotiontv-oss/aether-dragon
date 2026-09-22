import React, { useEffect, useRef } from 'react';
import { ThreeSceneManager } from '../../scenes/threeSceneManager';
import { LightingConfig, PerformanceStats, SceneId, CameraPreset } from '../../types';
import { globalAudioSynth } from '../../audio/AudioSynthesizer';

interface CanvasContainerProps {
  sceneId: SceneId;
  lightingConfig: LightingConfig;
  cameraPreset: CameraPreset;
  onStatsUpdate: (stats: PerformanceStats) => void;
  onManagerReady: (manager: ThreeSceneManager) => void;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  sceneId,
  lightingConfig,
  cameraPreset,
  onStatsUpdate,
  onManagerReady
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<ThreeSceneManager | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const manager = new ThreeSceneManager(
      containerRef.current,
      lightingConfig,
      globalAudioSynth,
      onStatsUpdate
    );
    managerRef.current = manager;
    onManagerReady(manager);

    // ResizeObserver for container bounds
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        manager.resize(width, height);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      manager.dispose();
      managerRef.current = null;
    };
  }, []);

  // Update scene when sceneId changes
  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.buildScene(sceneId);
    }
  }, [sceneId]);

  // Update lighting & shaders config
  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.updateConfig(lightingConfig);
    }
  }, [lightingConfig]);

  // Update camera preset
  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.setCameraPreset(cameraPreset);
    }
  }, [cameraPreset]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
