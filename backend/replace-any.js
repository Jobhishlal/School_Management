const fs = require('fs');
const path = require('path');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = findFiles(path.join(__dirname, 'src'));
console.log('Replacing any with unknown...');
let changed = 0;
for (const f of allFiles) {
  let content = fs.readFileSync(f, 'utf8');
  if (content.match(/\bany\b/)) {
    content = content.replace(/\bany\b/g, 'unknown');
    fs.writeFileSync(f, content, 'utf8');
    changed++;
  }
}
console.log(`Replaced in ${changed} files.`);
