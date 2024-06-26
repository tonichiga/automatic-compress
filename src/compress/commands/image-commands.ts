import { percentageToRange } from "../../shared/tools";
import {
  CompessMethod,
  CompressImageProps,
  ConverMethod,
  PathProps,
  PathnameProps,
  ProportionsProps,
  ScaleProps,
} from "../../types";

class CompressImage {
  constructor() {
    this.compressJpeg = this.compressJpeg.bind(this);
    this.compressJpg = this.compressJpg.bind(this);
    this.compressPng = this.compressPng.bind(this);
    this.compressWebp = this.compressWebp.bind(this);
    this.compressTiff = this.compressTiff.bind(this);
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

  /**
   * @params quality: number
   * @min 2 (better quality)
   * @max 31 (worse quality)
   * @default 20
   */
  compressJpeg(props: CompessMethod) {
    const q = percentageToRange(props.quality, 2, 31);
    return `ffmpeg -i ${props.inputPathname} -q:v ${q} ${props.outputPathname}`;
  }

  /**
   * @params quality: number
   * @min 2 (better quality)
   * @max 31 (worse quality)
   * @default 20
   */
  compressJpg(props: CompessMethod) {
    const q = percentageToRange(props.quality, 2, 31);
    return `ffmpeg -i ${props.inputPathname} -q:v ${q} ${props.outputPathname}`;
  }

  /**
   * @params quality: number
   * @min 0 (better quality)
   * @max 100 (worse quality)
   * @default 75
   * */
  compressPng(props: CompessMethod) {
    const q = percentageToRange(props.quality, 0, 75);
    return `ffmpeg -i ${props.inputPathname} -compression_level ${q} ${props.outputPathname}`;
  }

  /**
   * @params quality: number
   * @min 0 (better quality)
   * @max 100 (worse quality)
   * @default 75
   * */
  compressWebp(props: CompessMethod) {
    const q = percentageToRange(props.quality, 0, 100);
    return `ffmpeg -i ${props.inputPathname} -compression_level ${q} ${props.outputPathname}`;
  }

  /**
   * @params quality: string
   * @variants jpeg, zlib
   * @default lzw
   * */
  compressTiff(props: CompessMethod) {
    return `ffmpeg -i ${props.inputPathname} -compression_algo ${props.quality} ${props.outputPathname}`;
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

class ConvertImage {
  paths: PathnameProps[];

  constructor(params: CompressImageProps) {
    this.paths = params.paths;
  }

  /**
   * @params format: string
   * @variants jpg, jpeg, png, webp, tiff
   * */
  convert(props: ConverMethod) {
    const deleteExtension = (pathname: string) => {
      return pathname.replace(/\.[^/.]+$/, "");
    };

    return `ffmpeg -i ${props.inputPathname} ${deleteExtension(props.outputPathname)}.${props.toExtension}`;
  }
}

export { CompressImage, Resolutions, ConvertImage };
