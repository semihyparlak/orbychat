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

const targetDir = path.join(process.cwd(), 'resources', 'js');
const files = walk(targetDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.js'));

files.forEach(file => {
    const buf = fs.readFileSync(file);
    try {
        new TextDecoder('utf-8', { fatal: true }).decode(buf);
    } catch (e) {
        console.error(`INVALID UTF-8 in ${file}: ${e.message}`);
        // Find the bad byte
        for (let i = 0; i < buf.length; i++) {
            try {
                new TextDecoder('utf-8', { fatal: true }).decode(buf.slice(i, i + 1));
            } catch (inner) {
                // This might not be perfect for multibyte but it's a start
                console.log(`Bad byte at offset ${i}: ${buf[i]}`);
            }
        }
    }
});
