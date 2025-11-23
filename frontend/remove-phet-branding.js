const fs = require('fs');
const path = require('path');

/**
 * Script to remove PhET branding from simulation HTML files
 * Run this script to replace PhET branding with StreakWise branding
 */

const simulationsDir = path.join(__dirname, 'public', 'simulations');

// Patterns to replace
const replacements = [
    // Replace PhET text
    { from: /PhET Interactive Simulations/gi, to: 'StreakWise Interactive Simulation' },
    { from: /PhET/g, to: 'StreakWise' },
    { from: /phet\.colorado\.edu/gi, to: 'streakwise.app' },

    // Hide logo images by adding display:none style
    { from: /<img([^>]*class="[^"]*logo[^"]*"[^>]*)>/gi, to: '<img$1 style="display:none !important;">' },
    { from: /<img([^>]*alt="[^"]*PhET[^"]*"[^>]*)>/gi, to: '<img$1 style="display:none !important;">' },

    // Hide navbar elements
    { from: /<div([^>]*class="[^"]*navbar[^"]*phet[^"]*"[^>]*)>/gi, to: '<div$1 style="display:none !important;">' },
];

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        replacements.forEach(({ from, to }) => {
            if (content.match(from)) {
                content = content.replace(from, to);
                modified = true;
            }
        });

        if (modified) {
            // Create backup
            const backupPath = filePath + '.backup';
            if (!fs.existsSync(backupPath)) {
                fs.writeFileSync(backupPath, fs.readFileSync(filePath));
            }

            // Write modified content
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Modified: ${path.basename(filePath)}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        return false;
    }
}

function processDirectory(dir) {
    if (!fs.existsSync(dir)) {
        console.error(`Directory not found: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dir);
    let processedCount = 0;

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (file.endsWith('.html')) {
            if (processFile(filePath)) {
                processedCount++;
            }
        }
    });

    console.log(`\nProcessed ${processedCount} files in ${dir}`);
}

console.log('Starting PhET branding removal...\n');
processDirectory(simulationsDir);
console.log('\n✓ Done! Backups created with .backup extension');
console.log('To restore original files, remove .backup extension from backup files');
