const path = require('path');
const fs = require('fs/promises');
const secretFolder = path.resolve(__dirname, 'secret-folder/');
const showFiles = (files) => {
  for (let i = 0; i < files.length; i++) {
    let filePath = path.resolve(secretFolder, files[i]);
    let file = fs.stat(filePath);
    file.then(file =>{
      if (file.isFile()) {
        let ext = path.extname(filePath);
        let name = path.basename(filePath, ext);
        ext = ext.slice(1);
        let size = file.size;
        console.log(`${name} - ${ext} - ${size}bytes`);
      }
    }, () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));
    
  }
};

const files = fs.readdir(secretFolder);
files.then(result => showFiles(result), () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));
