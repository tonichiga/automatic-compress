import {
  CompessMethod,
  DirPathname,
  ExecCallbackProps,
  FfmpegConfig,
  FileHandlerProps,
  PathnameProps,
} from "../../types";
import { Compress as CompressImage } from "../commands/image-commands";
import { Compress as CompressVideo } from "../commands/video-commands";
import { FileHandler } from "../handlers/file-handler";
import { exec } from "child_process";

class FfmpegExecute extends FileHandler {
  inputDir: DirPathname;
  outputDir: DirPathname;
  type: "images" | "videos";

  constructor(parameters: FfmpegConfig) {
    super({
      inputDir: parameters.inputDir,
      outputDir: parameters.outputDir,
      type: parameters.type,
    });
    this.inputDir = parameters.inputDir;
    this.outputDir = parameters.outputDir;
    this.type = parameters.type;
  }

  executeFile({ inputPathname, outputPathname, command, callback }) {
    exec(command, (error, stdout, stderr, ...props) => {
      if (error) {
        console.error(`Ошибка при сжатии файла: ${error.message}`);
        return callback(null, { error });
      }

      callback({ inputPathname, outputPathname, command });
    });
  }

  getFilesByExtensions(paths: PathnameProps[]) {
    let extensions = {};
    const fileHandler = new FileHandler();
    paths.forEach(({ inputPathname, outputPathname }) => {
      const fileExtension = fileHandler.defineInputFileExtension(inputPathname);
      extensions = {
        ...extensions,
        [fileExtension]: [
          ...(extensions[fileExtension] || []),
          { inputPathname, outputPathname },
        ],
      };
    });

    return extensions;
  }

  async initialize() {
    this.clearDir();
    const { files } = await this.getFilesNames();
    const filePathnames = this.getFilePathname(files);
    return filePathnames;
  }

  async compressImage({ quality }) {
    const filePathnames = await this.initialize();
    if (!filePathnames) return console.log("Нет файлов для сжатия.");

    const compress = new CompressImage({
      paths: filePathnames,
    });

    const extensions = this.getFilesByExtensions(filePathnames);
    Object.keys(extensions).forEach((extension) => {
      const compressMethod: (props: CompessMethod) => string =
        compress.compressMethodByExtension()[extension];
      if (compressMethod) {
        extensions[extension].forEach(({ inputPathname, outputPathname }) => {
          try {
            const command = compressMethod({
              inputPathname,
              outputPathname,
              quality,
            });

            this.executeFile({
              inputPathname,
              outputPathname,
              command,
              callback: (response: ExecCallbackProps) => {
                console.log(`Success compress`, response.inputPathname);
              },
            });
          } catch (error) {
            console.log({ status: "error", message: error.message });
          }
        });
      }
    });
  }
}

export { FfmpegExecute };
