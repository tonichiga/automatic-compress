"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paths_1 = require("../src/compress/paths");
var compress_1 = require("./compress/image/compress");
var compress = new compress_1.default(paths_1.inputDirImage, paths_1.outputDirImage);
compress.start();
