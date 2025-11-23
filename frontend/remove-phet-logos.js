const fs = require('fs');
const path = require('path');

/**
 * Enhanced script to remove PhET branding including embedded logos
 * This script finds and removes base64-encoded PhET logos from simulation files
 */

const simulationsDir = path.join(__dirname, 'public', 'simulations');

// Common PhET logo patterns (base64 encoded images start with these)
const logoPatterns = [
    // SVG logos
    /data:image\/svg\+xml;base64,[A-Za-z0-9+/=]{100,}/g,
    // PNG logos  
    /data:image\/png;base64,iVBORw0KGgo[A-Za-z0-9+/=]{100,}/g,
];

function removeLogo(content) {
    let modified = content;

    // Try to find and replace logo data
    logoPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
            console.log(`  Found ${matches.length} potential logo(s)`);
            // Replace with a 1x1 transparent PNG
            const transparentPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
            modified = modified.replace(pattern, transparentPng);
        }
    });

    return modified;
}

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalSize = content.length;

        // Remove logos
        content = removeLogo(content);

        const modified = content.length !== originalSize;

        if (modified) {
            // Create backup if doesn't exist
            const backupPath = filePath + '.logo-backup';
            if (!fs.existsSync(backupPath)) {
                fs.writeFileSync(backupPath, fs.readFileSync(filePath));
            }

            // Write modified content
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Modified: ${path.basename(filePath)} (removed ${originalSize - content.length} bytes)`);
            return true;
        } else {
            console.log(`  Skipped: ${path.basename(filePath)} (no logos found)`);
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
        } else if (file.endsWith('.html') && !file.includes('.backup')) {
            console.log(`\nProcessing: ${file}`);
            if (processFile(filePath)) {
                processedCount++;
            }
        }
    });

    console.log(`\n✓ Processed ${processedCount} files`);
}

console.log('Removing PhET logos from simulations...\n');
console.log('Note: This may not catch all logos if they are dynamically generated.\n');
processDirectory(simulationsDir);
console.log('\n✓ Done! Logo backups created with .logo-backup extension');
