import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini AI initialization
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Route: Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Route: Generate Cyber Dragon Episode Script & Seedance Prompts
app.post('/api/dragon/generate-script', async (req, res) => {
  try {
    const { prompt, episodeType, durationSeconds } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      // Fallback local generated response if key not configured
      return res.json({
        success: true,
        isFallback: true,
        script: {
          title: "Cyber Dragon Episode: Awakened Salvation",
          logline: "When darkness envelopes the Neo-Citadel, the slumbering Cyber Dragon 9 ignites its core plasma engine to restore cosmic balance.",
          scenes: [
            {
              step: 1,
              title: "Step 1: Asset Prep & Character Sheet",
              cameraPrompt: "Cyber Dragon 9 front and 3/4 profile sheet, obsidian cybernetics, glowing cyan spine spikes, 4K render",
              action: "The ancient dragon lying dormant on the high-tech energy altar, blue runes glowing softly.",
              audioSyncTrack: "Sub-bass rumble 40Hz with distant siren atmospheric synth"
            },
            {
              step: 2,
              title: "Step 2: Storyboard & Scripting",
              cameraPrompt: "Cinematic wide shot of Dragon 9 spreading energy wings, volumetric plasma sparks, 30s native window",
              action: "Core engine ignites! Cyber Dragon opens laser eyes and unleashes a roaring plasma shockwave into the sky.",
              audioSyncTrack: "Heavy synthwave brass pulse with pentatonic dragon melody"
            },
            {
              step: 3,
              title: "Step 3: C Dance Multimodal Config",
              cameraPrompt: "Trajectory tilt upwards following cosmic plasma beam piercing dark storm clouds, saving the metropolis",
              action: "Cosmic plasma beam destroys the corrupted void rift, deploying a radiant Shield of Salvation around Earth.",
              audioSyncTrack: "Peak orchestral synth crescendo with rhythmic sub-bass pulse"
            },
            {
              step: 4,
              title: "Step 4: Video Extension & Pee Dub Export",
              cameraPrompt: "360 orbit camera around Cyber Dragon hovering victoriously over restored green digital city",
              action: "Dragon 9 roars in triumph as light spreads across the global network, securing peace.",
              audioSyncTrack: "Triumphant cyber fanfare fading into peaceful ambient theta chimes"
            }
          ]
        }
      });
    }

    const systemInstruction = `You are a master Animation Director & Scriptwriter specializing in the Dragon 9 cartoon universe and Seedance 2.5 (C Dance) AI animation pipeline.
    Generate a structured JSON episode script for a short cartoon clip titled "Cyber Dragon Wakes and Saves the World".
    Format your output strictly as valid JSON matching this schema:
    {
      "title": "Episode Title",
      "logline": "1 sentence logline",
      "scenes": [
        {
          "step": 1,
          "title": "Scene Name",
          "cameraPrompt": "Detailed visual/camera prompt for Seedance 2.5",
          "action": "Description of action",
          "audioSyncTrack": "Audio sync cues for rhythm and pacing"
        }
      ]
    }`;

    const userPrompt = `User Prompt: ${prompt || 'Cyber Dragon wakes and saves the world'}. Episode Type: ${episodeType || 'Action'}. Target Duration: ${durationSeconds || 30} seconds. Provide 4 distinct pipeline scenes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini model');
    }

    const scriptData = JSON.parse(text);
    return res.json({ success: true, isFallback: false, script: scriptData });
  } catch (error: any) {
    console.error('Error generating script:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate episode script',
    });
  }
});

// API Route: Generate 18-Minute Dragon 9 Master Comedy Package
app.post('/api/dragon/generate-18min-comedy', async (req, res) => {
  try {
    const ai = getGenAIClient();

    const master18MinComedy = {
      title: "Dragon 9: The 18-Minute Cyber Comedy Special — WiFi, Wings & Waffles",
      duration: "18:00 (1080 Seconds)",
      format: "Seedance 2.5 C Dance 36-Clip Batch Render (30s x 36)",
      resolution: "4K 60FPS Pee Dub Master",
      logline: "When Dragon 9 wakes up after 10,000 years with a terrible head cold and lost home WiFi password, it accidentally sets off the citadel alarm while trying to order breakfast, saving the universe completely by mistake.",
      acts: [
        {
          actNumber: 1,
          title: "Act I: Morning Alarm & Morning Sneeze (0:00 - 3:00)",
          scenes: [
            {
              clipId: 1,
              timecode: "00:00 - 00:30",
              title: "The Altar Alarm",
              dialogue: "Dragon 9: 'Who set the alarm for 7:00 AM in the year 3026?!'",
              cameraPrompt: "360 rotation around Cyber Dragon hitting snooze button with tail, comic dust particles",
              action: "Dragon 9 groggily slaps the ancient energy altar snooze crystal.",
              sfx: "Record scratch + electric buzzing alarm"
            },
            {
              clipId: 2,
              timecode: "00:30 - 01:00",
              title: "Plasma Sneeze Incident",
              dialogue: "Dragon 9: 'Achoo! Oh great, I burned the coffee maker again.'",
              cameraPrompt: "Extreme close up of Dragon 9 nostrils sparking cyan energy before a massive plasma sneeze",
              action: "A sneeze fires a cosmic beam through the citadel wall.",
              sfx: "Funny siren whistle + booming plasma belch"
            },
            {
              clipId: 3,
              timecode: "01:00 - 01:30",
              title: "Where is the Router?",
              dialogue: "Dragon 9: 'Is the 5G down or did the Dark Void chew the fiber optic cable?'",
              cameraPrompt: "Low angle shot of Dragon 9 squinting at a glowing router with tiny cyber glasses",
              action: "Dragon 9 inspects the router with its giant mechanical claws.",
              sfx: "Dial-up modem synth sound"
            },
            {
              clipId: 4,
              timecode: "01:30 - 02:00",
              title: "The Cyber Waffle Crisis",
              dialogue: "Cyber Henchman: 'Boss, the dark overlord is attacking!' Dragon 9: 'Not until I get syrup.'",
              cameraPrompt: "Dynamic split screen: Dark Armada approaching vs Dragon 9 making waffles",
              action: "Dragon 9 uses laser eyes to toast a gigantic waffle.",
              sfx: "Rimshot drum sting"
            },
            {
              clipId: 5,
              timecode: "02:00 - 02:30",
              title: "Stretching the Cyber Wings",
              dialogue: "Dragon 9: 'Ah, my back! That 10,000 year nap was terrible for my posture.'",
              cameraPrompt: "Wide lens tracking shot of energy wings expanding with bright cyan neon glow",
              action: "Wings unfurl, accidentally knocking over three villain scout ships.",
              sfx: "Bowling pin strike sound"
            },
            {
              clipId: 6,
              timecode: "02:30 - 03:00",
              title: "Accidental Heroics Begin",
              dialogue: "Citadel AI: 'Threat eliminated!' Dragon 9: 'Wait, I was just stretching!'",
              cameraPrompt: "Cinematic push-in on Dragon 9 looking confused as applause fills the citadel",
              action: "Dragon 9 scratches its horns in bewilderment.",
              sfx: "Sitcom studio audience applause"
            }
          ]
        },
        {
          actNumber: 2,
          title: "Act II: The Dark Void Confrontation (3:00 - 6:00)",
          scenes: [
            {
              clipId: 7,
              timecode: "03:00 - 03:30",
              title: "The Villain's Monologue",
              dialogue: "Lord Null: 'I have returned to destroy the realm!' Dragon 9: 'Could you speak louder? My ears are stuffed.'",
              cameraPrompt: "Dramatic shadow camera tilt on Lord Null interrupted by Dragon 9 cleaning ear with horn",
              action: "Lord Null gives an evil monologue; Dragon 9 pays no attention.",
              sfx: "Comedic slide whistle"
            },
            {
              clipId: 8,
              timecode: "03:30 - 04:00",
              title: "Laser Eye Staring Contest",
              dialogue: "Dragon 9: 'I haven't blinked in three millennia. Try me.'",
              cameraPrompt: "Extreme macro shot of laser eyes charging cyan plasma, reflections of tiny panicked spaceships",
              action: "Intense staring contest with the dark void fleet.",
              sfx: "High voltage hum"
            },
            {
              clipId: 9,
              timecode: "04:00 - 04:30",
              title: "The Misguided Fireball",
              dialogue: "Dragon 9: 'Take this! Wait, wrong button.'",
              cameraPrompt: "Tracking shot following a zig-zagging plasma fireball looping around the citadel 3 times",
              action: "Fireball curves unexpectedly and hits the villain's main power switch.",
              sfx: "Retro arcade boing sound"
            },
            {
              clipId: 10,
              timecode: "04:30 - 05:00",
              title: "Cyber Tail Slip",
              dialogue: "Dragon 9: 'Who left banana peel code in the matrix?!'",
              cameraPrompt: "Slow motion comedy tilt as Dragon 9 slips on a glitching energy tile",
              action: "Dragon 9 tail sweeps the entire enemy battalion into a garbage container.",
              sfx: "Slipping cartoon sound + crash"
            },
            {
              clipId: 11,
              timecode: "05:00 - 05:30",
              title: "The Tail Sweep Combo",
              dialogue: "Dragon 9: 'Strike! That's a full rack of dark cruisers!'",
              cameraPrompt: "Top-down camera view showing energy pinball trajectories",
              action: "Enemy cruisers bounce off the energetic shield like pinballs.",
              sfx: "Pinball chime cascade"
            },
            {
              clipId: 12,
              timecode: "05:30 - 06:00",
              title: "Halftime Snack Break",
              dialogue: "Dragon 9: 'Time out! My battery is at 15%.'",
              cameraPrompt: "Dragon 9 plugging a giant cyber cable into its tail while sitting on the altar",
              action: "Quick recharge session with battery icon floating overhead.",
              sfx: "Power-up chime"
            }
          ]
        },
        {
          actNumber: 3,
          title: "Act III: The Cosmic Dance Off (6:00 - 9:00)",
          scenes: [
            {
              clipId: 13,
              timecode: "06:00 - 06:30",
              title: "C Dance Activation",
              dialogue: "Dragon 9: 'Initiating Seedance 2.5 rhythm protocol!'",
              cameraPrompt: "Neon disco lights flashing over the high-tech energy altar as Dragon 9 pops its joints",
              action: "Dragon 9 starts robotic hip hop moves on the hex altar.",
              sfx: "80s synth bass beat drop"
            },
            {
              clipId: 14,
              timecode: "06:30 - 07:00",
              title: "Robot Wing Flap",
              dialogue: "Citadel AI: 'Motion sync locked at 120 FPS.'",
              cameraPrompt: "Rhythmic camera cuts matching wing flaps to 120 BPM tempo",
              action: "Energy wings pulse with rainbow neon hues in sync with the beat.",
              sfx: "Synth bass slap"
            },
            {
              clipId: 15,
              timecode: "07:00 - 07:30",
              title: "The Moonwalk Flight",
              dialogue: "Dragon 9: 'Hee-hee! Smooth operator of the cosmos!'",
              cameraPrompt: "Side scroll tracking shot of Dragon 9 moonwalking backward through space",
              action: "Dragon 9 hovers backward while dodging lasers effortlessly.",
              sfx: "Funky guitar riff"
            },
            {
              clipId: 16,
              timecode: "07:30 - 08:00",
              title: "The Villain Tries to Dance",
              dialogue: "Lord Null: 'I too know the dark tango!' Dragon 9: 'Bro, you have zero rhythm.'",
              cameraPrompt: "Two shot comparing dragon's slick moves vs villain's awkward flailing",
              action: "Villain trips over own cape; Dragon 9 laughs.",
              sfx: "Rimshot drum + buzzer"
            },
            {
              clipId: 17,
              timecode: "08:00 - 08:30",
              title: "Cosmic Breakdance Freeze",
              dialogue: "Dragon 9: 'Hold that pose for Seedance 2.5 frame keying!'",
              cameraPrompt: "Freeze frame matrix camera spin around Dragon 9 doing a one-claw stand",
              action: "Freeze frame snapshot effect with sparks frozen in mid air.",
              sfx: "Camera shutter click"
            },
            {
              clipId: 18,
              timecode: "08:30 - 09:00",
              title: "Rhythm Shockwave",
              dialogue: "Dragon 9: 'And for my final move... The Bass Drop!'",
              cameraPrompt: "Low frequency shockwave expanding 360 degrees across the stellar map",
              action: "Shockwave cleanses all dark corruption into confetti.",
              sfx: "Ultra sub-bass drop"
            }
          ]
        },
        {
          actNumber: 4,
          title: "Act IV: The Tech Support Nightmare (9:00 - 12:00)",
          scenes: [
            {
              clipId: 19,
              timecode: "09:00 - 09:30",
              title: "Calling Galactic Tech Support",
              dialogue: "Dragon 9: 'Your estimated wait time is 4 million lightyears.' Dragon 9: 'NOOOOO!'",
              cameraPrompt: "Zoom in on Dragon 9 holding a tiny holographic phone to its ear",
              action: "Elevator music plays while Dragon 9 groans.",
              sfx: "Muzak elevator tune"
            },
            {
              clipId: 20,
              timecode: "09:30 - 10:00",
              title: "Have You Tried Turning It Off?",
              dialogue: "Tech Bot: 'Have you unplugged the universe and plugged it back in?'",
              cameraPrompt: "Dragon 9 reaching for a galactic master plug behind the milky way",
              action: "Dragon 9 pulls plug, darkening the stars briefly.",
              sfx: "Power down whine"
            },
            {
              clipId: 21,
              timecode: "10:00 - 10:30",
              title: "The Firmware Update",
              dialogue: "Dragon 9: 'Firmware Update 9.04 installing... 1% complete.'",
              cameraPrompt: "Progress bar floating above Dragon 9 while it plays tic-tac-toe with its tail",
              action: "Dragon 9 frozen in mid animation waiting for update.",
              sfx: "Hourglass ticking"
            },
            {
              clipId: 22,
              timecode: "10:30 - 11:00",
              title: "Update Complete!",
              dialogue: "Dragon 9: 'New features: Turbo Tail, Laser Sight, and... Toast Holder?!'",
              cameraPrompt: "Explosive particle aura as Dragon 9 reboots with new shiny gold armor accents",
              action: "Dragon 9 tests new toast holder slot on neck.",
              sfx: "Triumphant fanfare"
            },
            {
              clipId: 23,
              timecode: "11:00 - 11:30",
              title: "Overclocked Nostrils",
              dialogue: "Dragon 9: 'Whoa, the ventilation is at 200%!'",
              cameraPrompt: "Volumetric fog blowing out of dragon nose at sonic speeds",
              action: "Fog clears all smoke and smog from the atmosphere.",
              sfx: "Turbine jet engine roar"
            },
            {
              clipId: 24,
              timecode: "11:30 - 12:00",
              title: "The Ultimate Spam Filter",
              dialogue: "Dragon 9: 'Blocking 40,000 dark void spam emails with one click!'",
              cameraPrompt: "Dragon 9 slamming red trash icon button in hologram",
              action: "Dark fleet disintegrates into harmless digital envelope pixels.",
              sfx: "Email send chime"
            }
          ]
        },
        {
          actNumber: 5,
          title: "Act V: Salvation by Blunder (12:00 - 15:00)",
          scenes: [
            {
              clipId: 25,
              timecode: "12:00 - 12:30",
              title: "The Final Void Boss Appears",
              dialogue: "Void Emperor: 'I am the ultimate dark entropy!' Dragon 9: 'Nice costume, did you make it yourself?'",
              cameraPrompt: "Gigantic shadowy silhouette looming over Earth vs Dragon 9 sipping boba tea",
              action: "Dragon 9 takes a sip from a giant boba cup.",
              sfx: "Slurping straw sound"
            },
            {
              clipId: 26,
              timecode: "12:30 - 13:00",
              title: "Boba Straw Cannon",
              dialogue: "Dragon 9: 'Phooey!'",
              cameraPrompt: "High-speed camera bullet time shot of a boba tapioca pearl flying through space at Mach 10",
              action: "Tapioca pearl hits boss right in the core power gem.",
              sfx: "Puck sound + glass shatter"
            },
            {
              clipId: 27,
              timecode: "13:00 - 13:30",
              title: "Shield of Salvation Deployment",
              dialogue: "Dragon 9: 'Deploying the world-saving umbrella!'",
              cameraPrompt: "Sphere geometric grid expanding 360 around planet Earth with glowing cyan runes",
              action: "Shield reflects all evil dark blasts into fireworks.",
              sfx: "Fireworks crackle"
            },
            {
              clipId: 28,
              timecode: "13:30 - 14:00",
              title: "The Cosmic High-Five",
              dialogue: "Dragon 9: 'Up high!' Citadel AI: 'Down low!'",
              cameraPrompt: "Dragon 9 giving a high five to a satellite, causing orbital wave effect",
              action: "High five reverberates through the solar system.",
              sfx: "Big crash + bell chime"
            },
            {
              clipId: 29,
              timecode: "14:00 - 14:30",
              title: "Villain Apologizes",
              dialogue: "Void Emperor: 'Okay okay, I surrender! Just please give me some waffles too!'",
              cameraPrompt: "Small defeated villain sitting next to dragon eating waffles together",
              action: "Dragon 9 shares waffle with former arch-nemesis.",
              sfx: "Wholesome comedy ukulele tune"
            },
            {
              clipId: 30,
              timecode: "14:30 - 15:00",
              title: "Global Victory Party",
              dialogue: "Citizens: 'Dragon 9 saved the world!' Dragon 9: 'I still haven't found my WiFi password though.'",
              cameraPrompt: "Wide pan over glowing green restored digital city with neon banners",
              action: "Confetti rains down as Dragon 9 dances.",
              sfx: "Cheering crowds"
            }
          ]
        },
        {
          actNumber: 6,
          title: "Act VI: Credits & Bloopers (15:00 - 18:00)",
          scenes: [
            {
              clipId: 31,
              timecode: "15:00 - 15:30",
              title: "Blooper 1: Missed Cue",
              dialogue: "Director: 'Cut! Dragon, you blew up the set early again!'",
              cameraPrompt: "Behind the scenes set view with green screen and boom mic falling",
              action: "Dragon 9 shrugs awkwardly.",
              sfx: "Laugh track"
            },
            {
              clipId: 32,
              timecode: "15:30 - 16:00",
              title: "Blooper 2: Wing Jam",
              dialogue: "Dragon 9: 'My wing is stuck in the garage door.'",
              cameraPrompt: "Dragon wing stuck in automated door, mechanic trying to pry it with crowbar",
              action: "Funny mechanical squeaks.",
              sfx: "Squeaky door sound"
            },
            {
              clipId: 33,
              timecode: "16:00 - 16:30",
              title: "Blooper 3: Forgotten Line",
              dialogue: "Dragon 9: 'Line? What's my line? Oh right... I am the Cyber Dragon!'",
              cameraPrompt: "Dragon 9 holding script page with tiny claw",
              action: "Puts on reading glasses.",
              sfx: "Paper turn sound"
            },
            {
              clipId: 34,
              timecode: "16:30 - 17:00",
              title: "Pee Dub Export Stamp",
              dialogue: "Seedance 2.5: '18-Minute Pee Dub Master Render Complete!'",
              cameraPrompt: "Golden C Dance stamp pressing onto 4K video frame",
              action: "Stamp creates radiant gold particle explosion.",
              sfx: "Heavy metal thud stamp"
            },
            {
              clipId: 35,
              timecode: "17:00 - 17:30",
              title: "Curtain Call",
              dialogue: "Dragon 9: 'Thanks for watching Dragon 9 Comedy! Don't forget to like & subscribe!'",
              cameraPrompt: "Dragon 9 bowing gracefully on the altar with fireworks behind",
              action: "Curtain falls slowly.",
              sfx: "Grand finale brass fanfare"
            },
            {
              clipId: 36,
              timecode: "17:30 - 18:00",
              title: "Post-Credits Stinger",
              dialogue: "Dragon 9: 'Wait... I found the WiFi password! It was 12345678!'",
              cameraPrompt: "Dark screen with green terminal text: 'CONNECTED TO COSMOS_5G'",
              action: "Screen flickers off with a funny pop.",
              sfx: "Pop sound + fade to silence"
            }
          ]
        }
      ]
    };

    return res.json({ success: true, masterPackage: master18MinComedy });
  } catch (error: any) {
    console.error('Error generating 18min comedy:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
