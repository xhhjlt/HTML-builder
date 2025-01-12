const path = require('path');
const fs = require('fs/promises');

const stylesPath = path.resolve(__dirname, 'styles');
const bundlePath = path.resolve(__dirname, 'project-dist', 'bundle.css');
const bundleStyles = (stylesPath, bundlePath) => {
  fs.readdir(stylesPath, {withFileTypes: true}).then(fileDirents => {
    for (let i = 0; i < fileDirents.length; i++) {
      let filePath = path.resolve(stylesPath, fileDirents[i].name);
      let fileExt = path.extname(filePath);
      if (fileDirents[i].isFile() && fileExt.toLocaleUpperCase() === '.CSS') {
        fs.readFile(filePath, 'utf-8').then(data => fs.appendFile(bundlePath, `${data}\n`) , () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));
      }}
  }, () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));
};

fs.writeFile(bundlePath, '').then(() => bundleStyles(stylesPath, bundlePath));
