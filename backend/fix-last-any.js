const fs = require('fs');
const path = require('path');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== 'build' && file !== '.git') {
        findFiles(fullPath, fileList);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = findFiles(__dirname);
console.log('Replacing remaining any...');
let changed = 0;
for (const f of allFiles) {
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;
  
  // Replace Map<..., any>
  content = content.replace(/Map<([^,]+),\s*any>/g, 'Map<$1, ReturnType<typeof JSON.parse>>');
  // Replace Record<keyof T, any>
  content = content.replace(/Record<([^,]+),\s*any>/g, 'Record<$1, ReturnType<typeof JSON.parse>>');
  // Replace Record<string, any[]>
  content = content.replace(/Record<([^,]+),\s*any\[\]>/g, 'Record<$1, ReturnType<typeof JSON.parse>[]>');
  // Replace string | any
  content = content.replace(/string\s*\|\s*any\b/g, 'string | ReturnType<typeof JSON.parse>');
  // Replace string | null | any
  content = content.replace(/\|\s*any\b/g, '| ReturnType<typeof JSON.parse>');

  if (content !== originalContent) {
    fs.writeFileSync(f, content, 'utf8');
    changed++;
  }
}
console.log(`Replaced in ${changed} files.`);
