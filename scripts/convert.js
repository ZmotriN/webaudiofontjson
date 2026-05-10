import fs from 'fs/promises';
import path from 'path';

const SRC_PATH = path.join(process.cwd(), '../webaudiofontdata/sound/');
const DST_PATH = path.join(process.cwd(), './src/presets/');


const GM_MAP = {
    0: ["Acoustic Grand Piano", "Piano"], 1: ["Bright Acoustic Piano", "Piano"], 2: ["Electric Grand Piano", "Piano"], 3: ["Honky-tonk Piano", "Piano"], 4: ["Electric Piano 1", "Piano"], 5: ["Electric Piano 2", "Piano"], 6: ["Harpsichord", "Piano"], 7: ["Clavinet", "Piano"],
    8: ["Celesta", "Chromatic Percussion"], 9: ["Glockenspiel", "Chromatic Percussion"], 10: ["Music Box", "Chromatic Percussion"], 11: ["Vibraphone", "Chromatic Percussion"], 12: ["Marimba", "Chromatic Percussion"], 13: ["Xylophone", "Chromatic Percussion"], 14: ["Tubular Bells", "Chromatic Percussion"], 15: ["Dulcimer", "Chromatic Percussion"],
    16: ["Drawbar Organ", "Organ"], 17: ["Percussive Organ", "Organ"], 18: ["Rock Organ", "Organ"], 19: ["Church Organ", "Organ"], 20: ["Reed Organ", "Organ"], 21: ["Accordion", "Organ"], 22: ["Harmonica", "Organ"], 23: ["Bandoneon", "Organ"],
    24: ["Acoustic Guitar (nylon)", "Guitar"], 25: ["Acoustic Guitar (steel)", "Guitar"], 26: ["Electric Guitar (jazz)", "Guitar"], 27: ["Electric Guitar (clean)", "Guitar"], 28: ["Electric Guitar (muted)", "Guitar"], 29: ["Overdriven Guitar", "Guitar"], 30: ["Distortion Guitar", "Guitar"], 31: ["Guitar Harmonics", "Guitar"],
    32: ["Acoustic Bass", "Bass"], 33: ["Electric Bass (finger)", "Bass"], 34: ["Electric Bass (picked)", "Bass"], 35: ["Fretless Bass", "Bass"], 36: ["Slap Bass 1", "Bass"], 37: ["Slap Bass 2", "Bass"], 38: ["Synth Bass 1", "Bass"], 39: ["Synth Bass 2", "Bass"],
    40: ["Violin", "Strings"], 41: ["Viola", "Strings"], 42: ["Cello", "Strings"], 43: ["Contrabass", "Strings"], 44: ["Tremolo Strings", "Strings"], 45: ["Pizzicato Strings", "Strings"], 46: ["Orchestral Harp", "Strings"], 47: ["Timpani", "Strings"],
    48: ["String Ensemble 1", "Ensemble"], 49: ["String Ensemble 2", "Ensemble"], 50: ["Synth Strings 1", "Ensemble"], 51: ["Synth Strings 2", "Ensemble"], 52: ["Choir Aahs", "Ensemble"], 53: ["Voice Oohs", "Ensemble"], 54: ["Synth Voice", "Ensemble"], 55: ["Orchestra Hit", "Ensemble"],
    56: ["Trumpet", "Brass"], 57: ["Trombone", "Brass"], 58: ["Tuba", "Brass"], 59: ["Muted Trumpet", "Brass"], 60: ["French Horn", "Brass"], 61: ["Brass Section", "Brass"], 62: ["Synth Brass 1", "Brass"], 63: ["Synth Brass 2", "Brass"],
    64: ["Soprano Sax", "Reed"], 65: ["Alto Sax", "Reed"], 66: ["Tenor Sax", "Reed"], 67: ["Baritone Sax", "Reed"], 68: ["Oboe", "Reed"], 69: ["English Horn", "Reed"], 70: ["Bassoon", "Reed"], 71: ["Clarinet", "Reed"],
    72: ["Piccolo", "Pipe"], 73: ["Flute", "Pipe"], 74: ["Recorder", "Pipe"], 75: ["Pan Flute", "Pipe"], 76: ["Blown bottle", "Pipe"], 77: ["Shakuhachi", "Pipe"], 78: ["Whistle", "Pipe"], 79: ["Ocarina", "Pipe"],
    80: ["Lead 1 (square)", "Synth Lead"], 81: ["Lead 2 (sawtooth)", "Synth Lead"], 82: ["Lead 3 (calliope)", "Synth Lead"], 83: ["Lead 4 (chiff)", "Synth Lead"], 84: ["Lead 5 (charang)", "Synth Lead"], 85: ["Lead 6 (voice)", "Synth Lead"], 86: ["Lead 7 (fifths)", "Synth Lead"], 87: ["Lead 8 (bass and lead)", "Synth Lead"],
    88: ["Pad 1 (new age)", "Synth Pad"], 89: ["Pad 2 (warm)", "Synth Pad"], 90: ["Pad 3 (polysynth)", "Synth Pad"], 91: ["Pad 4 (choir)", "Synth Pad"], 92: ["Pad 5 (bowed glass)", "Synth Pad"], 93: ["Pad 6 (metallic)", "Synth Pad"], 94: ["Pad 7 (halo)", "Synth Pad"], 95: ["Pad 8 (sweep)", "Synth Pad"],
    96: ["FX 1 (rain)", "Synth Effects"], 97: ["FX 2 (soundtrack)", "Synth Effects"], 98: ["FX 3 (crystal)", "Synth Effects"], 99: ["FX 4 (atmosphere)", "Synth Effects"], 100: ["FX 5 (brightness)", "Synth Effects"], 101: ["FX 6 (goblins)", "Synth Effects"], 102: ["FX 7 (echoes)", "Synth Effects"], 103: ["FX 8 (sci-fi)", "Synth Effects"],
    104: ["Sitar", "Ethnic"], 105: ["Banjo", "Ethnic"], 106: ["Shamisen", "Ethnic"], 107: ["Koto", "Ethnic"], 108: ["Kalimba", "Ethnic"], 109: ["Bag pipe", "Ethnic"], 110: ["Fiddle", "Ethnic"], 111: ["Shanai", "Ethnic"],
    112: ["Tinkle Bell", "Percussive"], 113: ["Agogô", "Percussive"], 114: ["Steel Drums", "Percussive"], 115: ["Woodblock", "Percussive"], 116: ["Taiko Drum", "Percussive"], 117: ["Melodic Tom", "Percussive"], 118: ["Synth Drum", "Percussive"], 119: ["Reverse Cymbal", "Percussive"],
    120: ["Guitar Fret Noise", "Sound Effects"], 121: ["Breath Noise", "Sound Effects"], 122: ["Seashore", "Sound Effects"], 123: ["Bird Tweet", "Sound Effects"], 124: ["Telephone Ring", "Sound Effects"], 125: ["Helicopter", "Sound Effects"], 126: ["Applause", "Sound Effects"], 127: ["Gunshot", "Sound Effects"]
};

const DRUM_MAP = {
    35: "Acoustic Bass Drum", 36: "Bass Drum 1", 37: "Side Stick", 38: "Acoustic Snare", 39: "Hand Clap",
    40: "Electric Snare", 41: "Low Floor Tom", 42: "Closed Hi Hat", 43: "High Floor Tom", 44: "Pedal Hi-Hat",
    45: "Low Tom", 46: "Open Hi-Hat", 47: "Low-Mid Tom", 48: "Hi-Mid Tom", 49: "Crash Cymbal 1",
    50: "High Tom", 51: "Ride Cymbal 1", 52: "Chinese Cymbal", 53: "Ride Bell", 54: "Tambourine",
    55: "Splash Cymbal", 56: "Cowbell", 57: "Crash Cymbal 2", 58: "Vibraslap", 59: "Ride Cymbal 2",
    60: "Hi Bongo", 61: "Low Bongo", 62: "Mute Hi Conga", 63: "Open Hi Conga", 64: "Low Conga",
    65: "High Timbale", 66: "Low Timbale", 67: "High Agogô", 68: "Low Agogô", 69: "Cabasa",
    70: "Maracas", 71: "Short Whistle", 72: "Long Whistle", 73: "Short Guiro", 74: "Long Guiro",
    75: "Claves", 76: "Hi Wood Block", 77: "Low Wood Block", 78: "Mute Cuica", 79: "Open Cuica",
    80: "Mute Triangle", 81: "Open Triangle"
};


function getDefaultChannel(midiNumber, isDrum) {
    if (isDrum) return 10;
    const p = midiNumber + 1;
    if ((p >= 1 && p <= 24) || (p >= 65 && p <= 80)) return 1;
    if ((p >= 33 && p <= 40) || (p >= 113 && p <= 120)) return 2;
    if ((p >= 41 && p <= 64) || (p >= 89 && p <= 104)) return 3;
    if ((p >= 25 && p <= 32) || (p >= 81 && p <= 88) || (p >= 105 && p <= 112)) return 4;
    return 1;
}

async function processJsFiles() {
    try {
        await fs.mkdir(DST_PATH, { recursive: true });
        const files = await fs.readdir(SRC_PATH);
        const jsFiles = files.filter(file => path.extname(file) === '.js');

        console.log(`🚀 Traitement de ${jsFiles.length} fichiers...`);

        for (const file of jsFiles) {
            const filePath = path.join(SRC_PATH, file);
            const fileNameWithExt = path.parse(file).name;
            const technicalId = fileNameWithExt.replace(/_file/i, '').replace(/_sf2/i, '').replace(/_gm/i, '');
            const match = technicalId.match(/^([0-9_]+)_(.*)$/);

            if (!match) continue;

            const presetIdStr = match[1]; 
            const bankName = match[2];
            let instrumentName, category, midiNumber, isDrum;
            let serie = 0;

            if (presetIdStr.startsWith('128')) {
                isDrum = true;
                category = "Drums";
                const drumNote = parseInt(presetIdStr.substring(3, 5));
                serie = presetIdStr.split('_')[1] || 0;
                instrumentName = DRUM_MAP[drumNote] || `Percussion (Note ${drumNote})`;
                midiNumber = 0; 
            } else {
                isDrum = false;
                midiNumber = parseInt(presetIdStr.split('_')[0]) % 128;
                [instrumentName, category] = GM_MAP[midiNumber] || ["Unknown", "Unknown"];
                serie = presetIdStr.substring(3, 4);
            }

            const defaultChannel = getDefaultChannel(midiNumber, isDrum);
            const rawContent = await fs.readFile(filePath, 'utf-8');
            const firstBrace = rawContent.indexOf('{');
            const lastBrace = rawContent.lastIndexOf('}');
            if (firstBrace === -1 || lastBrace === -1) continue;
			const objectString = rawContent.substring(firstBrace, lastBrace + 1);
            let audioData;
			
            try {
                audioData = new Function(`return ${objectString}`)();
            } catch (e) { continue; }

            const finalData = {
                id: technicalId,
                presetId: presetIdStr,
                bank: bankName,
                category: category,
                instrument: instrumentName,
                serie: +serie,
                channel: defaultChannel,
				number: midiNumber,
                zones: audioData.zones,
            };

            await fs.writeFile(
                path.join(DST_PATH, `${technicalId}.json`), 
                JSON.stringify(finalData, null, 2)
            );

            console.log(`✅ [${category}] ${instrumentName} (${bankName}) exported.`);
        }
        console.log("--- Finished ! ---");
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    }
}

processJsFiles();