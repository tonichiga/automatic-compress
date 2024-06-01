import {
  CompressImageProps,
  PathProps,
  PathnameProps,
  ProportionsProps,
  ScaleProps,
} from "../../types";
import { FileHandler } from "../handlers/file-handler";

class Compress {
  paths: PathnameProps[];

  constructor(params: CompressImageProps) {
    this.compressJpeg = this.compressJpeg.bind(this);
    this.compressJpg = this.compressJpg.bind(this);
    this.compressPng = this.compressPng.bind(this);
    this.compressWebp = this.compressWebp.bind(this);
    this.compressTiff = this.compressTiff.bind(this);

    if ("paths" in params) {
      this.paths = params.paths;
    }
  }

  compressMethodByExtension() {
    return {
      ".jpeg": this.compressJpeg,
      ".jpg": this.compressJpg,
      ".png": this.compressPng,
      ".webp": this.compressWebp,
      ".tiff": this.compressTiff,
    };
  }

  getFilesByExtensions(paths: PathnameProps[]) {
    let extensions = {};
    const fileHandler = new FileHandler();

    paths.forEach(({ inputPathname, outputPathname }) => {
      const fileExtension = fileHandler.defineInputFileExtension(inputPathname);
      extensions = {
        ...extensions,
        [fileExtension]: [
          ...extensions[fileExtension],
          { inputPathname, outputPathname },
        ],
      };
    });

    return extensions;
  }

  startCompress({
    quality,
    executeHandler,
  }): Promise<{ status: "success" } | { status: "error"; message: string }> {
    const extensions = this.getFilesByExtensions(this.paths);

    return new Promise((resolve, reject) => {
      Object.keys(extensions).forEach((extension) => {
        const compressMethod = this.compressMethodByExtension()[extension];
        if (compressMethod) {
          extensions[extension].forEach(({ inputPathname, outputPathname }) => {
            try {
              const command = compressMethod({
                inputPathname,
                outputPathname,
                quality,
              });
              executeHandler(inputPathname, outputPathname, command);
              resolve({ status: "success" });
            } catch (error) {
              reject({ status: "error", message: error.message });
            }
          });
        }
      });
    });
  }

  /**
   * @params quality: number
   * @min 2 (better quality)
   * @max 31 (worse quality)
   * @default 20
   */
  compressJpeg({
    quality = 20,
    inputPathname,
    outputPathname,
  }: PathnameProps & { quality?: number }) {
    return `ffmpeg -i ${inputPathname} -q:v ${quality} ${outputPathname}`;
  }

  /**
   * @params quality: number
   * @min 2 (better quality)
   * @max 31 (worse quality)
   * @default 20
   */
  compressJpg({
    quality = 20,
    inputPathname,
    outputPathname,
  }: PathnameProps & { quality?: number }) {
    return `ffmpeg -i ${inputPathname} -q:v ${quality} ${outputPathname}`;
  }

  /**
   * @params quality: number
   * @min 0 (better quality)
   * @max 100 (worse quality)
   * @default 75
   * */
  compressPng({
    quality = 75,
    inputPathname,
    outputPathname,
  }: PathnameProps & { quality?: number }) {
    return `ffmpeg -i ${inputPathname} -compression_level ${quality} ${outputPathname}`;
  }

  /**
   * @params quality: number
   * @min 0 (better quality)
   * @max 100 (worse quality)
   * @default 75
   * */
  compressWebp({
    quality = 75,
    inputPathname,
    outputPathname,
  }: PathnameProps & { quality?: number }) {
    return `ffmpeg -i ${inputPathname} -compression_level ${quality} ${outputPathname}`;
  }

  /**
   * @params quality: string
   * @variants jpeg, zlib
   * @default lzw
   * */
  compressTiff({
    inputPathname,
    outputPathname,
    quality = "lzw",
  }: PathnameProps & { quality?: "lzw" | "jpeg" | "zlib" }) {
    return `ffmpeg -i ${inputPathname} -compression_algo ${quality} ${outputPathname}`;
  }
}

class Resolutions {
  input: string;
  output: string;

  constructor({ inputPathname, outputPathname }: PathnameProps) {
    this.input = inputPathname;
    this.output = outputPathname;
  }

  /**
   * @params width: number
   * @params height: number
   * */
  manualScale({ width, height }: ScaleProps) {
    return `ffmpeg -i ${this.input} -vf "scale=${width}:${height}" ${this.output}`;
  }

  /**
   * @params coeff: number
   * */
  propotionalScale({ coeff }: ProportionsProps) {
    return `ffmpeg -i ${this.input} -vf "scale=iw/${coeff}:ih/${coeff}" ${this.output}`;
  }
}

class Convert {
  input: string;
  output: string;

  constructor({ input, output }: PathProps) {
    this.input = input;
    this.output = output;
  }

  /**
   * @params format: string
   * @variants jpg, jpeg, png, webp, tiff
   * */
  to(format: "jpg" | "jpeg" | "png" | "webp" | "tiff") {
    return `ffmpeg -i ${this.input} ${this.output}.${format}`;
  }
}

export { Compress, Resolutions, Convert };
