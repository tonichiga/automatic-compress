export const videoCommands = (input: string, output: string) => ({
  ".webm": `ffmpeg -i ${input} -vf "scale=iw/2:ih/2" -crf 40 -b:v 200k ${output}`,
  ".mp4": `ffmpeg -i ${input} -crf 30 -b:v 128k ${output}`,
  ".mov": `ffmpeg -i ${input} -c:v libvpx -crf 20 -b:v 200K -c:a libvorbis ${output}`,
});
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

export const imageCommands = (input: string, output: string) => ({
  // ".jpg": `ffmpeg -i ${input} -compression_level 100 ${output}`,//compress
  ".jpg": `ffmpeg -i ${input} -c:v libwebp -lossless 0 -q:v 75 "./src/output-image"`,
  ".jpeg": `ffmpeg -i ${input} -compression_level 100 ${output}`,
  ".png": `ffmpeg -i ${input} -vf "scale=iw/4:ih/4,format=rgba"  ${output}`,
  ".webp": `ffmpeg -i ${input} -vf "scale=iw/2:ih/2,format=rgba" -q:v 75 ${output}`,
});

const imageAction = {
  compress: (input: string, output: string) => {
    return {
      ".jpg": `ffmpeg -i ${input} -compression_level 100 ${output}`,
      ".jpeg": `ffmpeg -i ${input} -compression_level 100 ${output}`,
    };
  },
  resize: (input: string, output: string) => {
    return `ffmpeg -i ${input} -vf "scale=iw/4:ih/4,format=rgba"  ${output}`;
  },
  convert: (input: string, output: string) => {
    return `ffmpeg -i ${input} -c:v libwebp -lossless 0 -q:v 75 "./src/output-image"`;
  },
  convertWebp: (input: string, output: string) => {
    return `ffmpeg -i ${input} -vf "scale=iw/2:ih/2,format=rgba" -q:v 75 ${output}`;
  },
};
const videoAction = {};
