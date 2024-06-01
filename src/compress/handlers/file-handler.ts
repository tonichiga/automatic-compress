import { variables } from "../../shared/supported-extension";
import {
  DirPathname,
  FileHandlerProps,
  FileName,
  PathnameProps,
} from "../../types";
import * as path from "path";
import * as fs from "fs";

class FileHandler {
  inputDir: string;
  outputDir: string;
  type: "images" | "videos";

  constructor(params?: FileHandlerProps) {
    Object.assign(this, params);

    this.clearDir = this.clearDir.bind(this);
    this.getFilesNames = this.getFilesNames.bind(this);
    this.getFilePathname = this.getFilePathname.bind(this);
    this.defineInputFileExtension = this.defineInputFileExtension.bind(this);
    this.defineSupportedFileExtensions =
      this.defineSupportedFileExtensions.bind(this);
    this.moveFileToFolder = this.moveFileToFolder.bind(this);
    this.sortFiles = this.sortFiles.bind(this);
  }

  /*
    Get files names from input directory
  */
  async getFilesNames(): Promise<{ files: FileName[] }> {
    return new Promise((resolve, reject) => {
      const readDirHandler = (
        err: NodeJS.ErrnoException,
        files: FileName[]
      ) => {
        if (err) return reject(err);

        const _files = files.filter((file) => {
          const extension = this.defineSupportedFileExtensions()[
            this.type
          ].includes(path.extname(file).toLowerCase());

          return extension;
        });

        console.log("Файлы для сжатия: ", _files);

        resolve({ files: _files });
      };

      fs.readdir(this.inputDir, readDirHandler);
    });
  }

  /*
    Get file pathnames
  */
  getFilePathname(files: string[]): PathnameProps[] | void {
    if (!files && files?.length === 0) {
      return console.log("Нет файлов для сжатия.");
    }

    const filePathnames = files.map((file) => {
      return {
        inputPathname: path.join(this.inputDir, file),
        outputPathname: path.join(this.outputDir, `${file}`),
      };
    });

    return filePathnames;
  }

  /*
    Move file to folder
  */
  moveFileToFolder(file: FileName, inputDir: DirPathname) {
    Object.keys(variables).forEach((el: keyof typeof variables) => {
      const match = variables[el].includes(path.extname(file).toLowerCase());
      if (match) {
        fs.rename(
          path.join(inputDir, file),
          path.join(inputDir, el, file),
          (err) => {
            if (err) {
              console.error(`Ошибка при перемещении файла: ${err.message}`);
            }
          }
        );
      }
    });
  }

  /*
    Sort files in folders
  */
  sortFiles(files: FileName[]) {
    files.forEach((file) => {
      this.moveFileToFolder(file, this.inputDir);
    });
  }

  /*
    Clear directory
  */
  clearDir() {
    fs.readdir(this.outputDir, (err, files) => {
      if (err) {
        return console.error(`Ошибка при очистке директории: ${err.message}`);
      }

      for (const file of files) {
        fs.unlink(path.join(this.outputDir, file), (err) => {
          if (err) throw err;
        });
      }
    });
  }

  /*
    Define input file extension
  */
  defineInputFileExtension(file: string) {
    return path.extname(file).toLowerCase();
  }

  /*
    Define supported file extensions
  */
  defineSupportedFileExtensions() {
    return variables;
  }
}

export { FileHandler };
