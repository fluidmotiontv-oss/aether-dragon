import { SceneConfig, SceneId } from '../types';

export const SCENES: SceneConfig[] = [
  {
    id: 'cyber_dragon_awakening',
    title: 'Cyber Dragon Awakening & World Saver',
    category: 'Dragon 9 & Cyber Legends',
    description: 'The ancient Cyber Dragon awakens on a high-tech energy pedestal, unleashing cosmic plasma beams, energetic wing pulses, and world-saving shockwaves.',
    defaultParticles: 20000,
    primaryColor: '#00F0FF',
    secondaryColor: '#FF0055',
    tags: ['Cyber Dragon', 'World Saver', 'Cosmic Beam', 'Plasma Pulse', 'Dragon 9']
  },
  {
    id: 'cyberpunk',
    title: 'Neon Cyberpunk Metropolis',
    category: 'Sci-Fi & Urban',
    description: 'Holographic skyscraper towers, wet reflective ground reflections, volumetric rain particles, and flying light-trail drones.',
    defaultParticles: 15000,
    primaryColor: '#00F0FF',
    secondaryColor: '#FF007F',
    tags: ['Neon', 'Rain', 'Drones', 'Reflections', 'Hologram']
  },
  {
    id: 'quantum_blackhole',
    title: 'Quantum Cosmic Black Hole',
    category: 'Astrophysics & Deep Space',
    description: 'Relativistic accretion disk, gravitational lensing event horizon, plasma jet flares, and orbiting monoliths.',
    defaultParticles: 25000,
    primaryColor: '#FF9900',
    secondaryColor: '#B026FF',
    tags: ['Black Hole', 'Relativistic Jets', 'Cosmic Dust', 'Monoliths']
  },
  {
    id: 'zen_crystal_island',
    title: 'Zen Floating Crystal Island',
    category: 'Nature & Solfeggio',
    description: 'Floating low-poly sanctuary island with 528 Hz audio-reactive bioluminescent crystal spires and drifting sakura petals.',
    defaultParticles: 12000,
    primaryColor: '#00FF99',
    secondaryColor: '#00E5FF',
    tags: ['Floating Island', 'Audio Crystals', 'Sakura Petals', 'Aurora']
  },
  {
    id: 'bioluminescent_forest',
    title: 'Bioluminescent Alien Forest',
    category: 'Alien Flora',
    description: 'Futuristic flora with glowing vine tendrils, floating spore particles, and interactive light-orbs following your cursor.',
    defaultParticles: 18000,
    primaryColor: '#39FF14',
    secondaryColor: '#7B2CBF',
    tags: ['Glowing Flora', 'Interactive Light', 'Spore Orbs', 'Alien World']
  },
  {
    id: 'tesseract_lattice',
    title: 'Hypercube Quantum Tesseract',
    category: 'Geometry & 4D Physics',
    description: 'Nested 4D hypercube projections with glass refraction, laser matrix beams, and sound-reactive beat pulses.',
    defaultParticles: 10000,
    primaryColor: '#FFB300',
    secondaryColor: '#00F0FF',
    tags: ['4D Tesseract', 'Glass Refraction', 'Laser Matrix', 'Chrome']
  }
];

export function getSceneConfig(id: SceneId): SceneConfig {
  return SCENES.find((s) => s.id === id) || SCENES[0];
}
