const path = require('path');
const fs = require('fs');
const {
  stdin: input,
  stdout: output,
  exit
} = process;
const textFile = path.resolve(__dirname, 'text.txt');
const toFileStream = fs.createWriteStream(textFile);
const readline = require('readline');
const readlineConsole = readline.createInterface({
  input,
  output
});
const sayGoodBye = () => {
  readlineConsole.close();
  readlineConsole.off('line', inputHandler);
  output.write('Тебе еще многое предстоит\n');
  exit();
};
const inputHandler = (input) => {
  if (input === 'exit') {
    sayGoodBye();
  } else {
    toFileStream.write(`${input}\n`);
  }
};

readlineConsole.write('Молви друг и войди:\n');
readlineConsole.on('SIGINT', () => sayGoodBye());
readlineConsole.on('line', inputHandler);