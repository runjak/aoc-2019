import fs from "fs";
import {
  tensor2d,
  Tensor2D,
  Tensor1D,
  matMul,
  scalar,
  tensor1d,
  concat1d,
  stack,
  tidy
} from "@tensorflow/tfjs-node";
import { isProduction } from "./process";

export const getInput = () => String(fs.readFileSync("./src/16.input.txt"));

export const numbersFromInput = (input: string): Tensor1D =>
  tensor1d(
    input.split("").map(n => Number(n)),
    "int32"
  );

export const mkBasePattern = (n: number): Tensor1D => {
  const base = tensor2d([0, 1, 0, -1], [4, 1])
    .tile([1, n])
    .flatten();

  return base.slice(1).concat(base.slice(0, 1));
};

export const mkPattern = (n: number, length: number): Tensor1D => {
  const base = mkBasePattern(n);

  const replication = Math.ceil((length + 1) / base.size);
  return mkBasePattern(n)
    .tile([replication])
    .slice(0, length);
};

export const fftMatrix = (size: number): Tensor2D => {
  let rows: Array<Tensor1D> = [];
  for (let i = 0; i < size; i++) {
    rows.push(mkPattern(i + 1, size));
  }

  return stack(rows) as Tensor2D;
};

export const fftPhase = (inputs: Tensor1D): Tensor1D => {
  let values = tensor1d([]);

  for (let chunkSize = 1; chunkSize <= inputs.size; chunkSize++) {
    let negative = false;
    let chunks = tensor1d([]);

    for (
      let chunkStart = chunkSize - 1;
      chunkStart < inputs.size;
      chunkStart += 2 * chunkSize
    ) {
      const overlapsEnd = inputs.size <= chunkStart + chunkSize;
      const effectiveChunkSize = overlapsEnd
        ? Math.max(0, inputs.size - chunkStart)
        : chunkSize;

      const slice = inputs.slice(chunkStart, effectiveChunkSize);
      const effectiveSlice = negative
        ? (slice.mul(scalar(-1, "int32")) as Tensor1D)
        : slice;

      chunks = concat1d([chunks, effectiveSlice]);

      negative = !negative;
    }

    values = concat1d([values, chunks.sum(undefined, true) as Tensor1D]);
  }

  return values.abs().mod(10);
};

export const fftRepeatPhase = (inputs: Tensor1D, n: number): Tensor1D => {
  let values = inputs;

  for (let i = 0; i < n; i++) {
    values = tidy(() => fftPhase(values));
  }

  return values;
};

export const task1 = (): string =>
  fftRepeatPhase(numbersFromInput(getInput()), 100)
    .slice(0, 8)
    .arraySync()
    .join("");

export const fftRealComputation = (input: string): string => {
  const values = fftRepeatPhase(numbersFromInput(input).tile([10000]), 100);
  const offset = Number(
    values
      .slice(0, 8)
      .arraySync()
      .join("")
  );

  return values
    .slice(offset, 8)
    .arraySync()
    .join("");
};

if (isProduction()) {
  console.log(
    "80871224585914546619083218645595 ->",
    fftRealComputation("80871224585914546619083218645595"),
    "=== 84462026?"
  );
}
