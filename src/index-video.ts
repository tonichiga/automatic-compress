import { inputDirVideo, outputDirVideo } from "../src/compress/paths";
import { videoCommands } from "./compress/commands";
import CompressImage from "./compress/compress";

const compress = new CompressImage(
  inputDirVideo,
  outputDirVideo,
  videoCommands
);

compress.start();
