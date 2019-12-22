import fs from "fs";
import {
  tensor2d,
  Tensor2D,
  Tensor1D,
  matMul,
  scalar,
  abs,
  mod,
  tensor1d,
  tidy,
  concat1d,
  stack
} from "@tensorflow/tfjs-node";
import { isProduction } from "./process";

export const getInput = () => String(fs.readFileSync("./src/16.input.txt"));

export const numbersFromInput = (input: string): Tensor1D =>
  tensor1d(
    input.split("").map(n => Number(n)),
    "int32"
  );

export const mkPattern = (n: number, length: number): Tensor1D => {
  const base = tensor2d([0, 1, 0, -1], [4, 1])
    .tile([1, n])
    .flatten();

  const replication = Math.ceil((length + 1) / base.size);
  return base.tile([replication]).slice(1, length);
};

export const fftMatrix = (size: number): Tensor2D => {
  let rows: Array<Tensor1D> = [];
  for (let i = 0; i < size; i++) {
    rows.push(mkPattern(i + 1, size));
  }

  return stack(rows) as Tensor2D;
};

export const fftPhase = (values: Tensor1D): Array<number> => {
  const r = mod(
    abs(matMul(fftMatrix(values.size), values.as2D(values.size, 1))),
    scalar(10)
  );

  return r.as1D().arraySync();
};

export const expm = (matrix: Tensor2D, n: number): Tensor2D => {
  if (n <= 1) {
    return matrix;
  }

  if (n % 2 === 1) {
    return matMul(matrix, expm(matrix, n - 1));
  }

  return expm(matMul(matrix, matrix), n / 2);
};

export const fftRepeatPhase = (values: Tensor1D, n: number): Tensor1D => {
  const matrix = fftMatrix(values.size);
  const divisor = scalar(10);
  let tValues = values.as2D(values.size, 1);

  for (let i = 0; i < n; i++) {
    tValues = tidy(() => mod(abs(matMul(matrix, tValues)), divisor));
  }

  return tValues.as1D();
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
