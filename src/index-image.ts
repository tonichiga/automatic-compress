import { inputDirImage, outputDirImage } from "../src/compress/paths";
import CompressImage from "./compress/image/compress";

const compress = new CompressImage(inputDirImage, outputDirImage);

compress.start();
