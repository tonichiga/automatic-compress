import { PathProps } from "../../types";

class Compress {
  input: string;
  output: string;

  constructor({ input, output }: PathProps) {
    this.input = input;
    this.output = output;
  }
}

export { Compress };
