const path = require('path');
const fs = require('fs/promises');

const templateFile = path.resolve(__dirname, 'template.html');
const componentsDir = path.resolve(__dirname, 'components');
const assetsDir = path.resolve(__dirname, 'assets');
const stylesDir = path.resolve(__dirname, 'styles');
const distDir = path.resolve(__dirname, 'project-dist');
const distHTML = path.resolve(distDir, 'index.html');
const distCSS = path.resolve(distDir, 'style.css');

let template = fs.readFile(templateFile, 'utf-8');
let components = {};
fs.readdir(componentsDir).then(data => {
  for (let i = 0; i < data.length; i++) {
    let componentPath = path.resolve(componentsDir, data[i]);
    let componentExt = path.extname(componentPath);
    let componentName = path.basename(componentPath, componentExt);
    components[componentName] = fs.readFile(componentPath, 'utf-8');
  }
}, err => console.log(err));

const resolveTemplate = (str) => {
  let resultHTML = str;
  for (let key in components) {
    components[key].then(data => {resultHTML = resultHTML.replace(`{{${key}}}`, data); fs.writeFile(distHTML, resultHTML);}, err => console.log(err));
  }
};

function copyDir(basePath, copyPath) {
  const file = fs.stat(basePath);
  file.then(file =>{
    if (file.isDirectory()) {
      const files = fs.readdir(basePath);
      files.then(files => {
        for (let i = 0; i < files.length; i++) {
          fs.mkdir(copyPath, {recursive: true}).finally(() => copyDir(path.resolve(basePath, files[i]), path.resolve(copyPath, files[i])));
        }
      }, err => console.log(err));
    } else {
      fs.writeFile(copyPath, '').finally(() => fs.copyFile(basePath, copyPath));
    }
  }, err => console.log(err));
}

const bundleStyles = (stylesPath, bundlePath) => {
  fs.readdir(stylesPath, {withFileTypes: true}).then(fileDirents => {
    for (let i = 0; i < fileDirents.length; i++) {
      let filePath = path.resolve(stylesPath, fileDirents[i].name);
      let fileExt = path.extname(filePath);
      if (fileDirents[i].isFile() && fileExt === '.css') {
        fs.readFile(filePath, 'utf-8').then(data => fs.appendFile(bundlePath, `${data}\n`) , err => console.log(err));
      }}
  }, err => console.log(err));
};

fs.rm(distDir, { recursive: true, force: true }).finally(() => 
  fs.mkdir(distDir, {recursive: true}).then(() => {
    fs.writeFile(distHTML, '').then(() => {
      template.then((data) => {resolveTemplate(data);}, err => console.log(err));
    }, err => console.log(err));
    copyDir(assetsDir, path.resolve(distDir, 'assets'));
    fs.writeFile(distCSS, '').then(() => bundleStyles(stylesDir, distCSS));
  }, err => console.log(err))
);