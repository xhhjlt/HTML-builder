const path = require('path');
const fs = require('fs');

const textFile = path.resolve(__dirname, 'text.txt');
const readStream = fs.createReadStream(textFile, 'utf-8');
readStream.on('data', chunk => console.log(chunk));