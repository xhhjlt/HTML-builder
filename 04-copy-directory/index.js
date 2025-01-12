const path = require('path');
const fs = require('fs/promises');
const baseFolder = path.resolve(__dirname, 'files/');
const copyOfFolder = path.resolve(__dirname, 'files-copy/');

function copyDir(basePath, copyPath) {
  const file = fs.stat(basePath);
  file.then(file =>{
    if (file.isDirectory()) {
      const files = fs.readdir(basePath);
      files.then(files => {
        for (let i = 0; i < files.length; i++) {
          fs.mkdir(copyPath, {recursive: true}).finally(() => copyDir(path.resolve(basePath, files[i]), path.resolve(copyPath, files[i])));
        }
      }, () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));
    } else {
      fs.writeFile(copyPath, '').finally(() => fs.copyFile(basePath, copyPath));
    }
  }, () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));
}

fs.rm(copyOfFolder, { recursive: true, force: true }).finally(() => {copyDir(baseFolder, copyOfFolder);});