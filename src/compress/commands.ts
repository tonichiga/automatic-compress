export const videoCommands = (input: string, output: string) => ({
  ".webm": `fmpeg -i ${input} -c:v libvpx -crf 4 -b:v 1500K -c:a libvorbis ${output}`,
  ".mp4": `ffmpeg -i ${input} -c:v libx264 -crf 28 -b:v 1500K -c:a aac ${output}`,
  ".mov": `ffmpeg -i ${input} -c:v libx264 -crf 28 -b:v 1500K -c:a aac ${output}`,
});

export const imageCommands = (input: string, output: string) => ({
  ".jpg": `ffmpeg -i ${input} -compression_level 100 ${output}`,
  ".jpeg": `ffmpeg -i ${input} -compression_level 100 ${output}`,
  ".png": `ffmpeg -i ${input} -vf "scale=iw/4:ih/4,format=rgba"  ${output}`,
  ".webp": `ffmpeg -i ${input} -vf "scale=iw/4:ih/4,format=rgba"  ${output}`,
});
