import { AudioPreset } from '../types';

export class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeIntervals: number[] = [];
  
  private isPlaying = false;
  private currentPreset: AudioPreset = 'off';
  private frequencyData = new Uint8Array(64);

  constructor() {
    // AudioContext created lazily on user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volume: Float32Array | number) {
    const val = typeof volume === 'number' ? volume : 0.5;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  public playPreset(preset: AudioPreset, volume = 0.5) {
    this.stop();
    this.currentPreset = preset;

    if (preset === 'off') return;

    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    this.setVolume(volume);
    this.isPlaying = true;

    switch (preset) {
      case 'synthwave_pulse':
        this.setupSynthwavePulse();
        break;
      case 'cosmic_theta':
        this.setupCosmicTheta();
        break;
      case 'zen_crystal':
        this.setupZenCrystal();
        break;
      case 'cyber_bass':
        this.setupCyberBass();
        break;
      default:
        break;
    }
  }

  private setupSynthwavePulse() {
    if (!this.ctx || !this.masterGain) return;

    // Sub Bass Pulse (110 Hz A2 with LFO filter modulation)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(110, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);

    const filterGain = this.ctx.createGain();
    filterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    osc1.connect(filter);
    filter.connect(filterGain);
    filterGain.connect(this.masterGain);

    osc1.start();
    this.activeOscillators.push(osc1);

    // Arpeggiated Fifth Chords
    const chordNotes = [220, 277.18, 329.63, 440, 554.37, 659.25]; // A Major 7
    let noteIdx = 0;

    const arpInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();

      arpOsc.type = 'square';
      arpOsc.frequency.setValueAtTime(chordNotes[noteIdx % chordNotes.length], this.ctx.currentTime);

      arpGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      arpGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      arpOsc.connect(arpGain);
      arpGain.connect(this.masterGain);

      arpOsc.start();
      arpOsc.stop(this.ctx.currentTime + 0.36);

      noteIdx++;
    }, 180);

    this.activeIntervals.push(arpInterval);
  }

  private setupCosmicTheta() {
    if (!this.ctx || !this.masterGain) return;

    // 432 Hz Pure Resonance Carrier + 4 Hz Binaural Theta Offset
    const carrierLeft = this.ctx.createOscillator();
    const carrierRight = this.ctx.createOscillator();

    carrierLeft.type = 'sine';
    carrierLeft.frequency.setValueAtTime(432, this.ctx.currentTime);

    carrierRight.type = 'sine';
    carrierRight.frequency.setValueAtTime(436, this.ctx.currentTime); // 4 Hz binaural beat

    const gainL = this.ctx.createGain();
    const gainR = this.ctx.createGain();

    gainL.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gainR.gain.setValueAtTime(0.25, this.ctx.currentTime);

    carrierLeft.connect(gainL);
    carrierRight.connect(gainR);

    gainL.connect(this.masterGain);
    gainR.connect(this.masterGain);

    carrierLeft.start();
    carrierRight.start();

    this.activeOscillators.push(carrierLeft, carrierRight);

    // Sub-harmonic drone at 108 Hz
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(108, this.ctx.currentTime);
    subGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);

    subOsc.start();
    this.activeOscillators.push(subOsc);
  }

  private setupZenCrystal() {
    if (!this.ctx || !this.masterGain) return;

    // Pentatonic scale crystal chimes (528 Hz Solfeggio Love frequency baseline)
    const pentatonic = [528, 594, 660, 792, 880, 1056];

    const chimeInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;

      const randomNote = pentatonic[Math.floor(Math.random() * pentatonic.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(randomNote, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 2.6);
    }, 600);

    this.activeIntervals.push(chimeInterval);
  }

  private setupCyberBass() {
    if (!this.ctx || !this.masterGain) return;

    // Heavy 55 Hz Sub Bass + Wobble LFO
    const bassOsc = this.ctx.createOscillator();
    bassOsc.type = 'sawtooth';
    bassOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(5, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(2, this.ctx.currentTime); // 2 Hz wobble
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(600, this.ctx.currentTime);

    lfo.connect(filter.frequency);

    const bassGain = this.ctx.createGain();
    bassGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    bassOsc.connect(filter);
    filter.connect(bassGain);
    bassGain.connect(this.masterGain);

    bassOsc.start();
    lfo.start();

    this.activeOscillators.push(bassOsc, lfo);
  }

  public stop() {
    this.isPlaying = false;
    this.currentPreset = 'off';

    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore already stopped
      }
    });
    this.activeOscillators = [];

    this.activeIntervals.forEach((id) => window.clearInterval(id));
    this.activeIntervals = [];
  }

  public getFrequencyData(): Uint8Array {
    if (this.analyser && this.isPlaying) {
      this.analyser.getByteFrequencyData(this.frequencyData);
    } else {
      this.frequencyData.fill(0);
    }
    return this.frequencyData;
  }

  public getBassEnergy(): number {
    const data = this.getFrequencyData();
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += data[i];
    }
    return (sum / 8) / 255;
  }

  public getMidEnergy(): number {
    const data = this.getFrequencyData();
    let sum = 0;
    for (let i = 8; i < 28; i++) {
      sum += data[i];
    }
    return (sum / 20) / 255;
  }

  public getTrebleEnergy(): number {
    const data = this.getFrequencyData();
    let sum = 0;
    for (let i = 28; i < 64; i++) {
      sum += data[i];
    }
    return (sum / 36) / 255;
  }

  public getCurrentPreset(): AudioPreset {
    return this.currentPreset;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const globalAudioSynth = new AudioSynthesizer();
