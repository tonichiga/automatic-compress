import { inputDir } from "./compress/paths";

type FullPathname = string;
type DirPathname = string;
type DirPathnames = {
  inputDir: DirPathname;
  outputDir: DirPathname;
};
type FileName = string;

interface PathProps {
  output: string;
  input: string;
  isClearOutput?: boolean;
}

type CompressImageProps = { paths: PathnameProps[] };

interface PathnameProps {
  inputPathname: FullPathname;
  outputPathname: FullPathname;
}

interface FileHandlerProps {
  inputDir: string;
  outputDir: string;
  type: "images" | "videos";
}

interface FfmpegConfig {
  inputDir: DirPathname;
  outputDir: DirPathname;
  type: "images" | "videos";
}

interface ScaleProps {
  width: number;
  height: number;
}

interface ProportionsProps {
  coeff: number;
}

interface ExecCallbackProps {
  inputPathname: FullPathname;
  outputPathname: FullPathname;
  command: string;
}

interface CompessMethod extends PathnameProps {
  quality?: number | "lzw" | "jpeg" | "zlib";
}

export type {
  PathProps,
  ScaleProps,
  ProportionsProps,
  FileHandlerProps,
  FfmpegConfig,
  PathnameProps,
  CompressImageProps,
  FullPathname,
  DirPathname,
  DirPathnames,
  FileName,
  ExecCallbackProps,
  CompessMethod,
};
