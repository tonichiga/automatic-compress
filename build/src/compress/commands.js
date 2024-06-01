"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageCommands = exports.videoCommands = void 0;
var videoCommands = function (input, output) { return ({
    ".webm": "ffmpeg -i ".concat(input, " -vf \"scale=iw/2:ih/2\" -crf 40 -b:v 200k ").concat(output),
    ".mp4": "ffmpeg -i ".concat(input, " -crf 30 -b:v 128k ").concat(output),
    ".mov": "ffmpeg -i ".concat(input, " -c:v libvpx -crf 20 -b:v 200K -c:a libvorbis ").concat(output),
}); };
exports.videoCommands = videoCommands;
// export const videoCommands = (input: string, output: string) => ({
//   ".webm": [
//     "ffmpeg",
//     "-i",
//     input,
//     "-c:v",
//     "libvpx",
//     "-crf",
//     "30",
//     "-b:v",
//     "200K",
//     "-c:a",
//     "libvorbis",
//     output,
//   ],
//   ".mp4": [
//     "ffmpeg",
//     "-i",
//     input,
//     "-c:v",
//     "libvpx",
//     "-crf",
//     "10",
//     "-b:v",
//     "500K",
//     "-c:a",
//     "libvorbis",
//     output,
//   ],
//   ".mov": [
//     "ffmpeg",
//     "-i",
//     input,
//     "-c:v",
//     "libvpx",
//     "-crf",
//     "10",
//     "-b:v",
//     "500K",
//     "-c:a",
//     "libvorbis",
//     output,
//   ],
// });
var imageCommands = function (input, output) { return ({
    // ".jpg": `ffmpeg -i ${input} -compression_level 100 ${output}`,//compress
    ".jpg": "ffmpeg -i ".concat(input, " -c:v libwebp -lossless 0 -q:v 75 \"./src/output-image\""),
    ".jpeg": "ffmpeg -i ".concat(input, " -compression_level 100 ").concat(output),
    ".png": "ffmpeg -i ".concat(input, " -vf \"scale=iw/4:ih/4,format=rgba\"  ").concat(output),
    ".webp": "ffmpeg -i ".concat(input, " -vf \"scale=iw/2:ih/2,format=rgba\" -q:v 75 ").concat(output),
}); };
exports.imageCommands = imageCommands;
var imageAction = {
    compress: function (input, output) {
        return {
            ".jpg": "ffmpeg -i ".concat(input, " -compression_level 100 ").concat(output),
            ".jpeg": "ffmpeg -i ".concat(input, " -compression_level 100 ").concat(output),
        };
    },
    resize: function (input, output) {
        return "ffmpeg -i ".concat(input, " -vf \"scale=iw/4:ih/4,format=rgba\"  ").concat(output);
    },
    convert: function (input, output) {
        return "ffmpeg -i ".concat(input, " -c:v libwebp -lossless 0 -q:v 75 \"./src/output-image\"");
    },
    convertWebp: function (input, output) {
        return "ffmpeg -i ".concat(input, " -vf \"scale=iw/2:ih/2,format=rgba\" -q:v 75 ").concat(output);
    },
};
var videoAction = {};
