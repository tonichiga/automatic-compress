import { variables } from "@/shared/supported-extension";
import { FileHandlerProps, PathProps } from "../../types";
import * as path from "path";
import * as fs from "fs";

class FileHandler {
  input: string;
  output: string;
  type: "image" | "video";

  constructor({ input, output, type }: FileHandlerProps) {
    this.input = input;
    this.output = output;
    this.type = type;
  }

  getFilesNames(callback) {
    const readDirHandler = (err: NodeJS.ErrnoException, files: string[]) => {
      if (err) return callback(null, err);

      const _files = files.filter((file) => {
        const extension = this.defineSupportedFileExtensions()[
          this.type
        ].includes(path.extname(file).toLowerCase());

        Object.keys(variables).forEach((el: keyof typeof variables) => {
          const match = variables[el].includes(
            path.extname(file).toLowerCase()
          );

          if (match) {
            fs.rename(
              path.join(this.input, file),
              path.join(this.input, el, file),
              (err) => {
                if (err) {
                  console.error(`Ошибка при перемещении файла: ${err.message}`);
                }
              }
            );
          }
        });

        return extension;
      });

      callback(_files);
    };

    fs.readdir(this.input, readDirHandler);
  }

  getFilePathname(files: string[]) {
    if (files.length === 0) {
      return console.log("Нет файлов для сжатия.");
    }

    const filePathnames = files.map((file) => {
      return {
        inputPathname: path.join(this.input, file),
        outputPathname: path.join(this.output, `${file}`),
      };
    });

    return filePathnames;
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

  defineInputFileExtension(file: string) {
    return path.extname(file).toLowerCase();
  }

  defineSupportedFileExtensions() {
    return variables;
  }
}

export { FileHandler };

const handler = new FileHandler({});

handler.getFilesNames((files) => {
  console.log("files >>", files);
});
