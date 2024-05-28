"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paths_1 = require("../src/compress/paths");
var commands_1 = require("./compress/commands");
var compress_1 = require("./compress/compress");
var compress = new compress_1.default(paths_1.inputDirImage, paths_1.outputDirImage, commands_1.imageCommands);
compress.start();
