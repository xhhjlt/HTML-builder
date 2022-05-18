const path = require('path');
const fs = require('fs/promises');

const templateFile = path.resolve(__dirname, 'template.html');
const componentsDir = path.resolve(__dirname, 'components');
const distDir = path.resolve(__dirname, 'project-dist');
const distHTML = path.resolve(distDir, 'index.html');

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

fs.rm(distDir, { recursive: true, force: true }).finally(() => 
  fs.mkdir(distDir, {recursive: true}).then(() => {
    fs.writeFile(distHTML, '').then(() => {
      template.then((data) => {resolveTemplate(data);}, err => console.log(err));
    }, err => console.log(err));
  }, err => console.log(err))
);