import { inputDirImage, outputDirImage } from "../src/compress/paths";
import { imageCommands } from "./compress/commands";
import CompressImage from "./compress/compress";

const compress = new CompressImage(
  inputDirImage,
  outputDirImage,
  imageCommands
);

compress.start();
