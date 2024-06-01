import { FfmpegExecute } from "./compress/ffmpeg/execute";
import { inputDir, outputDir } from "./compress/paths";

const ffmeg = new FfmpegExecute({
  inputDir,
  outputDir,
  type: "images",
});

ffmeg.compressImage({
  quality: 30,
});

ffmeg.convertImage({
  toExtension: "webp",
});
