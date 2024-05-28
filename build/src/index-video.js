"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paths_1 = require("../src/compress/paths");
var commands_1 = require("./compress/commands");
var compress_1 = require("./compress/compress");
var compress = new compress_1.default(paths_1.inputDirVideo, paths_1.outputDirVideo, commands_1.videoCommands);
compress.start();
