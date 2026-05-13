import fs from 'fs/promises';
import path from 'path';

const GM_MAP_FILE = path.join(process.cwd(), './scripts/gmmap.json'); 
const PRESETS_PATH = path.join(process.cwd(), './src/presets/');
const OUTPUT_FILE = path.join(process.cwd(), './src/catalog.json');

/**
 * Détermine le canal MIDI par défaut selon la logique du projet
 */
function getDefaultChannel(p, isDrum) {
    if (isDrum) return 10;
    if ((p >= 1 && p <= 24) || (p >= 65 && p <= 80)) return 1;
    if ((p >= 33 && p <= 40) || (p >= 113 && p <= 120)) return 2;
    if ((p >= 41 && p <= 64) || (p >= 89 && p <= 104)) return 3;
    if ((p >= 25 && p <= 32) || (p >= 81 && p <= 88) || (p >= 105 && p <= 112)) return 4;
    return 1;
}

async function generateCatalog() {
    try {
        const files = await fs.readdir(PRESETS_PATH);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        console.log(`📊 Indexation of ${jsonFiles.length} presets...`);

        const banksMap = {};
        const categoriesMap = {};

        for (const file of jsonFiles) {
            const content = await fs.readFile(path.join(PRESETS_PATH, file), 'utf-8');
            const data = JSON.parse(content);
            
            const programNumber = data.num || -1;
            const isDrum = data.category.toLowerCase().includes('drum');

            // Gestion des banques
            if (!banksMap[data.bank]) {
                banksMap[data.bank] = { 
                    name: data.bank, 
                    presets: [] 
                };
            }
            banksMap[data.bank].presets.push({
                id: data.id,
                serie: data.serie,
                num: programNumber,
            });

            // Gestion des catégories avec ta logique de canaux
            const catName = data.category.toLowerCase();
            if (!categoriesMap[catName]) {
                categoriesMap[catName] = { 
                    name: data.category,
                    channel: getDefaultChannel(programNumber, isDrum),
                    instruments: {} 
                };
            }
            
            if (!categoriesMap[catName].instruments[data.instrument]) {
                categoriesMap[catName].instruments[data.instrument] = {
                    name: data.instrument,
                    program: programNumber,
                    presets: []
                };
            }
            
            categoriesMap[catName].instruments[data.instrument].presets.push({
                id: data.id,
                bank: data.bank,
                serie: data.serie,
                // program: programNumber,
            });
        }

        const banks = Object.values(banksMap).sort((a, b) => a.name.localeCompare(b.name));
        
        const categories = Object.values(categoriesMap).map(cat => ({
            name: cat.name,
            channel: cat.channel,
            instruments: Object.values(cat.instruments) //Object.values(cat.instruments).sort((a, b) => a.name.localeCompare(b.name))
        }));//.sort((a, b) => a.name.localeCompare(b.name));

        const mapdata = await fs.readFile(GM_MAP_FILE, 'utf-8');
        const gmmap = JSON.parse(mapdata);

        const catalog = {
            updatedAt: new Date().toISOString(),
            map: gmmap,
            banks,
            categories
        };

        await fs.writeFile(OUTPUT_FILE, JSON.stringify(catalog));

        console.log(`✅ Structured catalog generated with correct MIDI channels!`);

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    }
}

generateCatalog();