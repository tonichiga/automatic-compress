import { inputDirImage, outputDirImage } from "../src/compress/paths";
import { imageCommands } from "./compress/commands";
import CompressImage from "./compress/compress";
import * as chalk from "chalk";

const compress = new CompressImage(
  inputDirImage,
  outputDirImage,
  imageCommands
);

console.log(chalk.green("Compressing images..."));
compress.start();
