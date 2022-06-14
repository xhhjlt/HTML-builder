const path = require('path');
const fs = require('fs/promises');

const templateFile = path.resolve(__dirname, 'template.html');
const componentsDir = path.resolve(__dirname, 'components');
const assetsDir = path.resolve(__dirname, 'assets');
const stylesDir = path.resolve(__dirname, 'styles');
const distDir = path.resolve(__dirname, 'project-dist');
const distHTML = path.resolve(distDir, 'index.html');
const distCSS = path.resolve(distDir, 'style.css');

const resolveTemplate = (resultHTML, components) => {
  let tags = resultHTML.match(/{{\w*}}/gs) || [];
  for (let i = 0; i < tags.length; i++) {
    let tag = tags[i].slice(2, -2);
    if (!Object.keys(components).includes(tag.toLowerCase())) {
      let regexp = new RegExp (`{{${tag}}}`, 'gi');
      resultHTML = resultHTML.replace(regexp, '');
    }
  }
  fs.writeFile(distHTML, resultHTML);
  let takeComponents = Promise.all(Object.values(components));
  takeComponents.then(() => {
    for (let key in components) {
      components[key].then(data => {
        let regexp = new RegExp (`{{${key}}}`, 'gi');
        resultHTML = resultHTML.replace(regexp, data);
      });
    }
    
  }, () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...')).finally(() => {
    fs.writeFile(distHTML, resultHTML);
  });
};

function copyDir(basePath, copyPath) {
  const file = fs.stat(basePath);
  file.then(file => {
    if (file.isDirectory()) {
      const files = fs.readdir(basePath);
      files.then(files => {
        for (let i = 0; i < files.length; i++) {
          fs.mkdir(copyPath, {
            recursive: true
          }).finally(() => copyDir(path.resolve(basePath, files[i]), path.resolve(copyPath, files[i])));
        }
      }, () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));
    } else {
      fs.writeFile(copyPath, '').finally(() => fs.copyFile(basePath, copyPath));
    }
  }, () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));
}

const bundleStyles = (stylesPath, bundlePath) => {
  fs.readdir(stylesPath, { withFileTypes: true }).then(fileDirents => {
    for (let i = 0; i < fileDirents.length; i++) {
      let filePath = path.resolve(stylesPath, fileDirents[i].name);
      let fileExt = path.extname(filePath);
      if (fileDirents[i].isFile() && fileExt === '.css') {
        fs.readFile(filePath, 'utf-8').then(data => fs.appendFile(bundlePath, `${data}\n`), () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));
      }
    }
  }, () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));
};

fs.readdir(__dirname, {withFileTypes: true}).then(dirArr => {
  let needs = {'assets':'folder', 'components':'folder', 'styles':'folder', 'template.html':'file'};
  for (let key in needs) {
    let isExist = false; 
    let isRightType = false;
    for (let i = 0; i < dirArr.length; i++) {
      if (dirArr[i].name === key) {
        isExist = true;
        if (needs[key] === 'folder' && dirArr[i].isDirectory) isRightType = true;
        if (needs[key] === 'file' && dirArr[i].isFile) isRightType = true;
      }
    }
    if (!(isExist && isRightType)) {
      console.log(`You need "${key}" ${needs[key]} for build-page script`);
      process.exit();
    }
  }
  fs.readdir(componentsDir, {withFileTypes: true}).then(data => {

    let components = {};
    for (let i = 0; i < data.length; i++) {
      let componentPath = path.resolve(componentsDir, data[i].name);
      let componentExt = path.extname(componentPath);
      let componentName = path.basename(componentPath, componentExt).toLowerCase();
      if (componentExt.toLocaleUpperCase() === '.HTML' && data[i].isFile()) {
        components[componentName] = fs.readFile(componentPath, 'utf-8');
      }
    }

    let template = fs.readFile(templateFile, 'utf-8');

    fs.rm(distDir, {
      recursive: true,
      force: true
    }).finally(() =>
      fs.mkdir(distDir, {
        recursive: true
      }).then(() => {

        fs.writeFile(distHTML, '').then(() => {
          template.then((data) => {
            resolveTemplate(data, components);
          }, () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));
        }, () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));

        copyDir(assetsDir, path.resolve(distDir, 'assets'));

        fs.writeFile(distCSS, '').then(() => bundleStyles(stylesDir, distCSS), () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));

      }, () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'))
    );
  }, () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));
}, () => console.log('Оглянитесь по сторонам...произошло что-то непонятное...'));

