const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Replace catch (error: any) with catch (error: unknown)
  const catchRegex = /catch\s*\(\s*(error|err)\s*:\s*any\s*\)/g;
  if (catchRegex.test(content)) {
    content = content.replace(catchRegex, 'catch ($1: unknown)');
    changed = true;
  }

  // 2. Replace error.message with (error as Error).message, carefully
  // Only if we see `catch (error: unknown)` or `catch (err: unknown)`
  if (/catch\s*\(\s*error\s*:\s*unknown\s*\)/.test(content)) {
    const errorMsgRegex = /(?<!as\sError\)\.)error\.message/g;
    if (errorMsgRegex.test(content)) {
      content = content.replace(errorMsgRegex, '(error as Error).message');
      changed = true;
    }
    const errorErrorsRegex = /(?<!as\sany\)\.)error\.errors/g;
    if (errorErrorsRegex.test(content)) {
      content = content.replace(errorErrorsRegex, '(error as any).errors');
      changed = true;
    }
  }

  if (/catch\s*\(\s*err\s*:\s*unknown\s*\)/.test(content)) {
    const errMsgRegex = /(?<!as\sError\)\.)err\.message/g;
    if (errMsgRegex.test(content)) {
      content = content.replace(errMsgRegex, '(err as Error).message');
      changed = true;
    }
  }

  // 3. Replace data: any in validators
  const dataAnyRegex = /(validate[a-zA-Z0-9_]+)\s*\(\s*data\s*:\s*any/g;
  if (dataAnyRegex.test(content)) {
    content = content.replace(dataAnyRegex, '$1(data: Record<string, unknown>');
    changed = true;
  }

  // 4. Also general occurrences of `data: any` in controllers/services might be replaced with `data: Record<string, unknown>`
  // Or let's handle specific `(data: any)`
  // Wait, there are `(file: any)` in controllers
  const fileAnyRegex = /\(file:\s*any\)/g;
  if (fileAnyRegex.test(content)) {
    content = content.replace(fileAnyRegex, '(file: Express.Multer.File)');
    changed = true;
  }

  // 5. Some other generic `: any`
  // let's look at remaining `: any` after these
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated: ' + filePath);
  }
}

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (filePath.endsWith('.ts')) {
    processFile(filePath);
  }
});
