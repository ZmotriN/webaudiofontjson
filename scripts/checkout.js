import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const REPO_URL = 'https://github.com/surikov/webaudiofontdata.git';
const TARGET_DIR = path.join(process.cwd(), 'webaudiofontdata');

async function downloadJsClean() {
    try {
        if (!fs.existsSync(TARGET_DIR)) {
            fs.mkdirSync(TARGET_DIR, { recursive: true });
        }

        console.log('🚀 Téléchargement des fichiers .js...');

        // 1. Initialisation temporaire de Git pour le filtrage
        execSync('git init', { cwd: TARGET_DIR });
        execSync(`git remote add origin ${REPO_URL}`, { cwd: TARGET_DIR });
        execSync('git config core.sparseCheckout true', { cwd: TARGET_DIR });

        // 2. Définition du filtre (uniquement les .js dans le dossier sound)
        fs.writeFileSync(path.join(TARGET_DIR, '.git/info/sparse-checkout'), 'sound/*.js');

        // 3. Récupération des données
        execSync('git pull --depth 1 origin master', { cwd: TARGET_DIR, stdio: 'inherit' });

        // 4. Suppression des traces de GIT
        console.log('🧹 Nettoyage des traces Git...');
        const gitDir = path.join(TARGET_DIR, '.git');
        
        // Utilisation de rmSync pour supprimer le dossier .git récursivement
        fs.rmSync(gitDir, { recursive: true, force: true });

        // Optionnel : remonter les fichiers pour éviter le sous-dossier /sound/
        // Si tu veux que les fichiers soient directement dans /sounds/ au lieu de /sounds/sound/
        
        console.log(`\n✅ Terminé ! Les fichiers sont dans ./sounds/sound/ (Dossier .git supprimé)`);

    } catch (error) {
        console.error('❌ Erreur :', error.message);
        
        // En cas d'erreur, on essaie quand même de nettoyer si le dossier .git existe
        const gitDir = path.join(TARGET_DIR, '.git');
        if (fs.existsSync(gitDir)) {
            fs.rmSync(gitDir, { recursive: true, force: true });
        }
    }
}

downloadJsClean();