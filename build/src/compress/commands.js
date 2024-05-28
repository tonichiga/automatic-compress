"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageCommands = exports.videoCommands = void 0;
var videoCommands = function (input, output) { return ({
    ".webm": [
        "ffmpeg",
        "-i",
        input,
        "-c:v",
        "libvpx",
        "-crf",
        "10",
        "-b:v",
        "500K",
        "-c:a",
        "libvorbis",
        output,
    ],
    ".mp4": [
        "ffmpeg",
        "-i",
        input,
        "-c:v",
        "libvpx",
        "-crf",
        "10",
        "-b:v",
        "500K",
        "-c:a",
        "libvorbis",
        output,
    ],
    ".mov": [
        "ffmpeg",
        "-i",
        input,
        "-c:v",
        "libvpx",
        "-crf",
        "10",
        "-b:v",
        "500K",
        "-c:a",
        "libvorbis",
        output,
    ],
}); };
exports.videoCommands = videoCommands;
var imageCommands = function (input, output) { return ({
    ".jpg": "ffmpeg -i ".concat(input, " -compression_level 100 ").concat(output),
    ".jpeg": "ffmpeg -i ".concat(input, " -compression_level 100 ").concat(output),
    ".png": "ffmpeg -i ".concat(input, " -vf \"scale=iw/4:ih/4,format=rgba\"  ").concat(output),
    ".webp": "ffmpeg -i ".concat(input, " -vf \"scale=iw/4:ih/4,format=rgba\"  ").concat(output),
}); };
exports.imageCommands = imageCommands;
