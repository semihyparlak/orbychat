const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
};

// Map of common corruption sequences to their clean versions.
// We also include the residual artifacts left by previous bad attempts.
const fixMapping = [
    { from: /-â€”/g, to: ' — ' },
    { from: /-â€¦/g, to: '…' },
    { from: /-â€œ/g, to: '“' },
    { from: /-â€\?/g, to: '”' },
    { from: /-â€™/g, to: '’' },
    { from: /-â€¢/g, to: '•' },
    { from: /-€”/g, to: ' — ' },
    { from: /-€¦/g, to: '…' },
    { from: /-†’/g, to: '→' },
    { from: /-•/g, to: '·' },
    { from: /â€”/g, to: ' — ' },
    { from: /â€¦/g, to: '…' },
    { from: /â€œ/g, to: '“' },
    { from: /â€\?/g, to: '”' },
    { from: /â€™/g, to: '’' },
    { from: /â€¢/g, to: '•' },
    { from: /Â·/g, to: '·' },
    { from: /Â/g, to: '' }
];

const targetDir = path.join(process.cwd(), 'resources', 'js');
const files = walk(targetDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.js'));

files.forEach(file => {
    let raw = fs.readFileSync(file);
    
    // Check for UTF-8 BOM (EF BB BF)
    if (raw[0] === 0xEF && raw[1] === 0xBB && raw[2] === 0xBF) {
        raw = raw.slice(3);
        console.log(`Removed BOM: ${file}`);
    }

    let content = raw.toString('utf8');
    let changed = false;

    fixMapping.forEach(m => {
        if (m.from.test(content)) {
            content = content.replace(m.from, m.to);
            changed = true;
        }
    });

    if (changed) {
        console.log(`Fixed: ${file}`);
        fs.writeFileSync(file, content, 'utf8');
    }
});
