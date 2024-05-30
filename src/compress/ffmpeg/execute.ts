import { FfmpegConfig, FileHandlerProps, PathnameProps } from "../../types";
import { Compress as CompressImage } from "../commands/image-commands";
import { Compress as CompressVideo } from "../commands/video-commands";
import { FileHandler } from "../handlers/file-handler";
import { exec } from "child_process";

class FfmpegExecute extends FileHandler {
  filePathnames: PathnameProps[];
  type: FileHandlerProps["type"];
  compress: typeof CompressImage | typeof CompressVideo;
  action: FfmpegConfig["action"];

  constructor(parameters: FfmpegConfig) {
    super(parameters);
    this.type = parameters.type;
  }

  compressFile(inputPath, outputPath, callback) {
    const fileExtension = this.defineInputFileExtension(inputPath);

    // const commands[this.type].commands();

    exec("command", (error, stdout, stderr, ...props) => {
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

  convertImage(to: string) {
    this.clearDir();

    this.filePathnames.forEach(async (filePath) => {
      //   this.defineCompressType({
      //     inputPathname: filePath.inputPathname,
      //     outputPathname: filePath.outputPathname,
      //   });
    });
  }

  //   compress(quality: number) {
  //     this.clearDir();
  //   }

  initialize() {
    this.clearDir();

    const getFilesNamesHandler = (files: string[]) => {
      const filePathnames = this.getFilePathname(files);
      if (!filePathnames) return;
      this.filePathnames = filePathnames;
    };

    this.getFilesNames(getFilesNamesHandler);
  }

  compressImage() {
    this.initialize();

    return new CompressImage({ paths: this.filePathnames });
  }
}

export { FfmpegExecute };

const i = new FfmpegExecute({ type: "image" });
