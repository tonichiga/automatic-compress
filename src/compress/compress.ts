import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { spawn } from "child_process";
import * as readline from "readline";

class CompressImage {
  input: string;
  output: string;
  commands: Function;

  constructor(input: string, output: string, commands: Function) {
    this.input = input;
    this.output = output;
    this.commands = commands;

    this.calculateTotalSize = this.calculateTotalSize.bind(this);
    this.compressFile = this.compressFile.bind(this);
    this.fileHandler = this.fileHandler.bind(this);
    this.getFiles = this.getFiles.bind(this);
    this.clearDir = this.clearDir.bind(this);
    this.compressAllFiles = this.compressAllFiles.bind(this);
    this.defineInputFileExtension = this.defineInputFileExtension.bind(this);
    this.ffmpegExec = this.ffmpegExec.bind(this);
  }

  getFiles(callback) {
    fs.readdir(this.input, (err, files) => {
      if (err) {
        return callback(err);
      }
      const _files = files.filter((file) =>
        this.defineSupportedFileExtensions().includes(
          path.extname(file).toLowerCase()
        )
      );

      console.log("support:", this.defineSupportedFileExtensions());
      console.log(`Найдено файлов: ${_files.length}`);
      callback(null, _files);
    });
  }

  async calculateTotalSize({ inputFile, outputFile }, callback) {
    function getFileSize(file): Promise<number> {
      return new Promise((resolve) => {
        fs.stat(file, (err, stats) => {
          if (err) {
            return callback({}, err);
          }

          resolve(stats.size as number);
        });
      });
    }

    try {
      const inputFileSize = await getFileSize(inputFile);
      const outputFileSize = await getFileSize(outputFile);

      callback({
        inputSize: inputFileSize,
        outputSize: outputFileSize,
      });
    } catch (error) {
      console.error(`Ошибка при вычислении размера файла: ${error.message}`);
    }
  }

  ffmpegExec(inputPath, outputPath, callback) {
    const fileExtension = this.defineInputFileExtension(inputPath);
    const command = this.commands(inputPath, outputPath)[fileExtension];

    const ffmpeg = spawn("ffmpeg", command);

    // Интерфейс для построчного чтения stderr
    const rl = readline.createInterface({
      input: ffmpeg.stderr,
      output: process.stdout,
      terminal: false,
    });

    // Регулярное выражение для поиска времени из вывода ffmpeg
    const timePattern = /time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/;

    rl.on("line", (line) => {
      // Найти время в строке
      const match = timePattern.exec(line);
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        console.log(`Progress: ${totalSeconds} seconds`);
        callback(null);
      }
    });

    ffmpeg.on("close", (code) => {
      console.log(`ffmpeg process exited with code ${code}`);
    });
  }

  compressFile(inputPath, outputPath, callback) {
    // const command = `ffmpeg -i "${inputPath}" -compression_level 100 "${outputPath}"`;
    // const downScale = `ffmpeg -i "${inputPath}" -vf "scale=iw/4:ih/4,format=rgba"  "${outputPath}"`;

    const fileExtension = this.defineInputFileExtension(inputPath);
    const command = this.commands(inputPath, outputPath)[fileExtension];

    console.log(`Сжатие файла: ${inputPath}`);

    exec(command, (error, stdout, stderr, ...props) => {
      if (error) {
        console.error(`Ошибка при сжатии файла: ${error.message}`);
        return callback(error);
      }
      // if (stderr) {
      //   console.error(`FFmpeg stderr: ${stderr}`);
      // }

      callback(null);
    });
  }

  fileHandler(err, files) {
    let filesQuantity = 0;
    let totalSizeAfterCompress = 0;
    let totalSizeBeforeCompress = 0;

    if (err) {
      return console.error(`Ошибка при чтении директории: ${err.message}`);
    }
    if (files.length === 0) {
      return console.log("Нет файлов для сжатия.");
    }

    files.forEach(async (file) => {
      const inputPath = path.join(this.input, file);
      const outputPath = path.join(this.output, `${file}`);

      await new Promise((resolve) =>
        this.compressFile(inputPath, outputPath, (err) => {
          this.calculateTotalSize(
            { inputFile: inputPath, outputFile: outputPath },
            ({ inputSize, outputSize }) => {
              totalSizeBeforeCompress += inputSize;
              totalSizeAfterCompress += outputSize;
              filesQuantity++;

              if (files.length === filesQuantity) {
                return resolve({ message: "done" });
              }
            }
          );

          if (err) {
            console.error(`Ошибка при сжатии файла ${file}: ${err.message}`);
          }
        })
      );

      console.log(
        `Total size before compress ${Math.round(
          totalSizeBeforeCompress / 1024
        )}кб,`
      );
      console.log(
        `Total size after compress ${Math.round(
          totalSizeAfterCompress / 1024
        )}кб`
      );
      console.log(`Total files ${filesQuantity}`);
    });
  }

  clearDir() {
    fs.readdir(this.output, (err, files) => {
      if (err) {
        return console.error(`Ошибка при очистке директории: ${err.message}`);
      }

      for (const file of files) {
        fs.unlink(path.join(this.output, file), (err) => {
          if (err) throw err;
        });
      }
    });
  }

  compressAllFiles() {
    this.clearDir();

    this.getFiles(this.fileHandler);
  }

  defineInputFileExtension(file) {
    return path.extname(file).toLowerCase();
  }

  defineSupportedFileExtensions() {
    return Object.keys(this.commands(this.input, this.output));
  }

  start() {
    this.compressAllFiles();
  }
}

export default CompressImage;
