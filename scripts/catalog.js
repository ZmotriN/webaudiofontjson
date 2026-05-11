import fs from 'fs/promises';
import path from 'path';

const GM_MAP_FILE = path.join(process.cwd(), './scripts/gmmap.json'); 
const PRESETS_PATH = path.join(process.cwd(), './src/presets/');
const OUTPUT_FILE = path.join(process.cwd(), './src/catalog.json');


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

            if (!banksMap[data.bank]) {
                banksMap[data.bank] = { 
                    name: data.bank, 
                    presets: [] 
                };
            }
            banksMap[data.bank].presets.push({
                id: data.id,
                serie: data.serie,
				num: data.num || -1,
            });

            const catName = data.category.toLowerCase();
            if (!categoriesMap[catName]) {
                categoriesMap[catName] = { 
                    name: data.category, 
                    instruments: {} 
                };
            }
            
            if (!categoriesMap[catName].instruments[data.instrument]) {
                categoriesMap[catName].instruments[data.instrument] = {
                    name: data.instrument,
                    presets: []
                };
            }
            
            categoriesMap[catName].instruments[data.instrument].presets.push({
                id: data.id,
                bank: data.bank,
                serie: data.serie,
				num: data.num || -1,
            });
        }


        const banks = Object.values(banksMap).sort((a, b) => a.name.localeCompare(b.name));
        
        const categories = Object.values(categoriesMap).map(cat => ({
            name: cat.name,
            instruments: Object.values(cat.instruments).sort((a, b) => a.name.localeCompare(b.name))
        })).sort((a, b) => a.name.localeCompare(b.name));

		const mapdata = await fs.readFile(GM_MAP_FILE, 'utf-8');
		const gmmap = JSON.parse(mapdata);

        const catalog = {
            updatedAt: new Date().toISOString(),
			map: gmmap,
            banks,
            categories
        };

        await fs.writeFile(OUTPUT_FILE, JSON.stringify(catalog));

        console.log(`✅ Structured catalog generated!`);

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    }
}

generateCatalog();