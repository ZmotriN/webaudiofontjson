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

        console.log('🚀 Downloading .js files...');

        execSync('git init', { cwd: TARGET_DIR });
        execSync(`git remote add origin ${REPO_URL}`, { cwd: TARGET_DIR });
        execSync('git config core.sparseCheckout true', { cwd: TARGET_DIR });

        fs.writeFileSync(path.join(TARGET_DIR, '.git/info/sparse-checkout'), 'sound/*.js');

        execSync('git pull --depth 1 origin master', { cwd: TARGET_DIR, stdio: 'inherit' });

        console.log('🧹 Nettoyage des traces Git...');
        const gitDir = path.join(TARGET_DIR, '.git');
        
        fs.rmSync(gitDir, { recursive: true, force: true });

		console.log(`\n✅ Finished!`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        
        const gitDir = path.join(TARGET_DIR, '.git');
        if (fs.existsSync(gitDir)) {
            fs.rmSync(gitDir, { recursive: true, force: true });
        }
    }
}

downloadJsClean();