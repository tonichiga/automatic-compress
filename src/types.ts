interface PathProps {
  output: string;
  input: string;
  isClearOutput?: boolean;
}

type CompressImageProps =
  | { paths: PathnameProps[] }
  | {
      input: string;
      output: string;
    };

interface PathnameProps {
  inputPathname: string;
  outputPathname: string;
}

interface FileHandlerProps extends PathProps {
  type: "image" | "video";
}

interface FfmpegConfig extends FileHandlerProps {
  quality: number;
  action: "compress" | "convert";
}

interface ScaleProps {
  width: number;
  height: number;
}

interface ProportionsProps {
  coeff: number;
}

export type {
  PathProps,
  ScaleProps,
  ProportionsProps,
  FileHandlerProps,
  FfmpegConfig,
  PathnameProps,
  CompressImageProps,
};
