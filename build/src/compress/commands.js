"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageCommands = exports.videoCommands = void 0;
var videoCommands = function (input, output) { return ({
    ".webm": "fmpeg -i ".concat(input, " -c:v libvpx -crf 4 -b:v 1500K -c:a libvorbis ").concat(output),
    ".mp4": "ffmpeg -i ".concat(input, " -c:v libx264 -crf 28 -b:v 1500K -c:a aac ").concat(output),
    ".mov": "ffmpeg -i ".concat(input, " -c:v libx264 -crf 28 -b:v 1500K -c:a aac ").concat(output),
}); };
exports.videoCommands = videoCommands;
var imageCommands = function (input, output) { return ({
    ".jpg": "ffmpeg -i ".concat(input, " -compression_level 100 ").concat(output),
    ".jpeg": "ffmpeg -i ".concat(input, " -compression_level 100 ").concat(output),
    ".png": "ffmpeg -i ".concat(input, " -vf \"scale=iw/4:ih/4,format=rgba\"  ").concat(output),
    ".webp": "ffmpeg -i ".concat(input, " -vf \"scale=iw/4:ih/4,format=rgba\"  ").concat(output),
}); };
exports.imageCommands = imageCommands;
