import {
  CompressImageProps,
  PathProps,
  PathnameProps,
  ProportionsProps,
  ScaleProps,
} from "../../types";

class Compress {
  input?: string;
  output?: string;
  paths: PathnameProps[];

  constructor(params: CompressImageProps) {
    if ("paths" in params) {
      this.paths = params.paths;
    }

    if ("input" in params && "output" in params) {
      this.input = params.input;
      this.output = params.output;
    }
  }

  /**
   * @params quality: number
   * @min 2 (better quality)
   * @max 31 (worse quality)
   * @default 20
   */
  compressJpeg(quality: number = 20) {
    if (this.paths.length) {
      return this.paths.map(({ inputPathname, outputPathname }) => {
        return `ffmpeg -i ${inputPathname} -q:v ${quality} ${outputPathname}`;
      });
    }

    return `ffmpeg -i ${this.input} -q:v ${quality} ${this.output}`;
  }

  /**
   * @params quality: number
   * @min 2 (better quality)
   * @max 31 (worse quality)
   * @default 20
   */
  compressJpg(quality: number = 20) {
    if (this.paths.length) {
      return this.paths.map(({ inputPathname, outputPathname }) => {
        return `ffmpeg -i ${inputPathname} -q:v ${quality} ${outputPathname}`;
      });
    }

    return `ffmpeg -i ${this.input} -q:v ${quality} ${this.output}`;
  }

  /**
   * @params quality: number
   * @min 0 (better quality)
   * @max 100 (worse quality)
   * @default 75
   * */
  compressPng(quality: number = 75) {
    if (this.paths.length) {
      return this.paths.map(({ inputPathname, outputPathname }) => {
        return `ffmpeg -i ${inputPathname} -compression_level ${quality} ${outputPathname}`;
      });
    }

    return `ffmpeg -i ${this.input} -compression_level ${quality} ${this.output}`;
  }

  /**
   * @params quality: number
   * @min 0 (better quality)
   * @max 100 (worse quality)
   * @default 75
   * */
  compressWebp(quality: number = 75) {
    if (this.paths.length) {
      return this.paths.map(({ inputPathname, outputPathname }) => {
        return `ffmpeg -i ${inputPathname} -compression_level ${quality} ${outputPathname}`;
      });
    }

    return `ffmpeg -i ${this.input} -compression_level ${quality} ${this.output}`;
  }

  /**
   * @params quality: string
   * @variants jpeg, zlib
   * @default lzw
   * */
  compressTiff(quality: "lzw" | "jpeg" | "zlib" = "lzw") {
    if (this.paths.length) {
      return this.paths.map(({ inputPathname, outputPathname }) => {
        return `ffmpeg -i ${inputPathname} -compression_algo ${quality} ${outputPathname}`;
      });
    }

    return `ffmpeg -i ${this.input} -compression_algo ${quality} ${this.output}`;
  }
}

class Resolutions {
  input: string;
  output: string;

  constructor({ input, output }: PathProps) {
    this.input = input;
    this.output = output;
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
