import * as readline from "readline";
import * as fs from "fs";
import { spawn } from "child_process";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Какой index.js вы хотите запустить (image или video)? ",
  (answer) => {
    if (answer === "image" || answer === "video") {
      const indexFile = `index-${answer}.js`;
      if (fs.existsSync(indexFile)) {
        const childProcess = spawn("node", [indexFile]);
        childProcess.stdout.pipe(process.stdout);
        childProcess.stderr.pipe(process.stderr);
      } else {
        console.error(`Файл ${indexFile} не найден.`);
      }
    } else {
      console.error("Пожалуйста, введите image или video.");
    }
    rl.close();
  }
);
