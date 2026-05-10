import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const SRC_DIR = './src/presets';
const DST_DIR = './dist/presets';

async function processJsonFiles() {
    try {
        if (!fs.existsSync(DST_DIR)) {
            fs.mkdirSync(DST_DIR, { recursive: true });
        }

        const files = fs.readdirSync(SRC_DIR);
        const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');

        console.log(`Fichiers trouvés : ${jsonFiles.length}`);

        for (const file of jsonFiles) {
            const srcPath = path.join(SRC_DIR, file);
            const dstPath = path.join(DST_DIR, `${file}.gz`);

            try {
                // Lecture synchrone pour garantir la récupération du contenu
                const rawData = fs.readFileSync(srcPath, 'utf8');
                
                // Minification : On parse et on re-stringify immédiatement
                const minifiedData = JSON.stringify(JSON.parse(rawData));

                // Création d'un Readable stream à partir de la chaîne de caractères
                const sourceStream = Readable.from([minifiedData]);
                
                const gzip = zlib.createGzip();
                const destinationStream = fs.createWriteStream(dstPath);

                await pipeline(
                    sourceStream,
                    gzip,
                    destinationStream
                );

                // Optionnel: log tous les 100 fichiers pour ne pas inonder la console
                // if (jsonFiles.indexOf(file) % 100 === 0) console.log(`Avancement...`);
				console.log(`✅ [GZIP] ${file}.gz exported.`);

            } catch (fileErr) {
                console.error(`❌ Erreur sur le fichier ${file}:`, fileErr.message);
            }
        }

        console.log('\n✅ Opération terminée avec succès.');
    } catch (err) {
        console.error('Erreur fatale :', err.message);
    }
}

processJsonFiles();