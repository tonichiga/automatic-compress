const fs = require("fs");
import * as path from "path";
import { exec } from "child_process";
import { imageCommands } from "../commands";

class CompressImage {
  input: string;
  output: string;

  constructor(input: string, output: string) {
    this.input = input;
    this.output = output;

    this.calculateTotalSize = this.calculateTotalSize.bind(this);
    this.compressImage = this.compressImage.bind(this);
    this.fileHandler = this.fileHandler.bind(this);
    this.getFiles = this.getFiles.bind(this);
    this.clearDir = this.clearDir.bind(this);
    this.compressAllJpgImages = this.compressAllJpgImages.bind(this);
    this.defineInputFileExtension = this.defineInputFileExtension.bind(this);
  }

  getFiles(callback) {
    fs.readdir(this.input, (err, files) => {
      if (err) {
        return callback(err);
      }
      const jpgFiles = files.filter((file) =>
        this.defineSuppertedFileExtensions().includes(
          path.extname(file).toLowerCase()
        )
      );
      callback(null, jpgFiles);
    });
  }

  async calculateTotalSize({ inputFile, outputFile }, callback) {
    function getFileSize(file): Promise<number> {
      return new Promise((resolve) => {
        fs.stat(file, (err, stats) => {
          if (err) {
            return callback(null, err);
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

  compressImage(inputPath, outputPath, callback) {
    // const command = `ffmpeg -i "${inputPath}" -compression_level 100 "${outputPath}"`;
    // const downScale = `ffmpeg -i "${inputPath}" -vf "scale=iw/4:ih/4,format=rgba"  "${outputPath}"`;

    const fileExtension = this.defineInputFileExtension(inputPath);
    const command = imageCommands(inputPath, outputPath)[fileExtension];

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка при сжатии изображения: ${error.message}`);
        return callback(error);
      }
      if (stderr) {
        console.error(`FFmpeg stderr: ${stderr}`);
      }
      // console.log(`Сжатие завершено: ${outputPath}`);
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
      return console.log("Нет PNG-файлов для сжатия.");
    }

    files.forEach(async (file) => {
      const inputPath = path.join(this.input, file);
      const outputPath = path.join(this.output, `${file}`);

      await new Promise((resolve) =>
        this.compressImage(inputPath, outputPath, (err) => {
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

  compressAllJpgImages() {
    this.clearDir();

    this.getFiles(this.fileHandler);
  }

  defineInputFileExtension(file) {
    return path.extname(file).toLowerCase();
  }

  defineSuppertedFileExtensions() {
    const commands = imageCommands(this.input, this.output);
    return Object.keys(commands);
  }

  start() {
    this.compressAllJpgImages();
  }
}

export default CompressImage;
