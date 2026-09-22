export type SceneId = 
  | 'cyberpunk' 
  | 'quantum_blackhole' 
  | 'zen_crystal_island' 
  | 'bioluminescent_forest' 
  | 'tesseract_lattice';

export type CameraPreset = 'orbit' | 'cinematic_wide' | 'isometric' | 'top_down' | 'first_person';

export type AudioPreset = 'synthwave_pulse' | 'cosmic_theta' | 'zen_crystal' | 'cyber_bass' | 'off';

export interface SceneConfig {
  id: SceneId;
  title: string;
  category: string;
  description: string;
  defaultParticles: number;
  primaryColor: string;
  secondaryColor: string;
  tags: string[];
}

export interface LightingConfig {
  dirLightX: number;
  dirLightY: number;
  dirLightZ: number;
  dirLightColor: string;
  dirLightIntensity: number;
  ambientColor: string;
  ambientIntensity: number;
  fogDensity: number;
  fogColor: string;
  wireframe: boolean;
  shadows: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;
  fov: number;
  bloomGlow: number;
  chromaticAberration: number;
  particleCount: number;
  particleSpeed: number;
  waveAmplitude: number;
  audioReactivity: number;
}

export interface PerformanceStats {
  fps: number;
  frameTimeMs: number;
  triangles: number;
  drawCalls: number;
  geometries: number;
  textures: number;
}

export type ActivePanel = 'scenes' | 'inspector' | 'particles' | 'audio' | 'camera' | 'stats';
