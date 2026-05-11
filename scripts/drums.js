import fs from 'fs/promises';
import path from 'path';

const PRESETS_PATH = path.join(process.cwd(), './src/presets/');
const OUTPUT_PATH = path.join(process.cwd(), './src/presets/');


async function unlinkWithRetry(filePath, retries = 5, delay = 500) {
    for (let i = 0; i < retries; i++) {
        try {
            await fs.unlink(filePath);
            return;
        } catch (error) {
            if (i === retries - 1) throw error;
            
            console.warn(`⚠️ File blocked, new try in ${delay}ms... (${i + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
}

async function mergeDrums() {
    try {
        await fs.mkdir(OUTPUT_PATH, { recursive: true });

        const files = await fs.readdir(PRESETS_PATH);
        const drumFiles = files.filter(f => f.startsWith('128') && f.endsWith('.json'));

        const drumKits = {};

        console.log(`🔍 Analyzing ${drumFiles.length} drum files...`);

        for (const file of drumFiles) {
            const content = await fs.readFile(path.join(PRESETS_PATH, file), 'utf-8');
            const data = JSON.parse(content);

            const formattedSerie = String(data.serie).padStart(2, '0');
            const kitKey = `128${formattedSerie}_${data.bank}`;

            if (!drumKits[kitKey]) {
                drumKits[kitKey] = {
                    id: kitKey,
                    presetId: `128${formattedSerie}`, 
                    bank: data.bank,
                    category: "Drums",
                    instrument: `${data.bank} Drum Kit`,
                    serie: data.serie,
                    channel: 10,
                    zones: []
                };
            }

            if (data.zones && Array.isArray(data.zones)) {
                drumKits[kitKey].zones.push(...data.zones);
            }
        }

        const keys = Object.keys(drumKits);
        for (const key of keys) {
            const finalKit = drumKits[key];
            finalKit.zones.sort((a, b) => a.keyRangeLow - b.keyRangeLow);

            const fileName = `${key}.json`;
            await fs.writeFile(
                path.join(OUTPUT_PATH, fileName),
                JSON.stringify(finalKit)
            );
            console.log(`✅ Drum Kit merged: ${fileName} (${finalKit.zones.length} zones)`);
        }

        console.log(`\n🧹 File cleaning: ${PRESETS_PATH}...`);
        for (const file of drumFiles) {
            const filePath = path.join(PRESETS_PATH, file);
            try {
                await unlinkWithRetry(filePath);
            } catch (err) {
                console.error(`❌ Can't delete ${file} after multiple try: ${err.message}`);
            }
        }

        console.log(`\n✨ Finished! ${keys.length} drum kits generated.`);

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    }
}

mergeDrums();