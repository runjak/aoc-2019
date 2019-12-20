import fs from "fs";
import zipWith from "lodash/zipWith";
import sum from "lodash/sum";
import {
  tensor2d,
  Tensor2D,
  matMul,
  scalar,
  abs,
  mod
} from "@tensorflow/tfjs-node";
import * as tf from "@tensorflow/tfjs-node";

export const getInput = () => String(fs.readFileSync("./src/16.input.txt"));

export const numbersFromInput = (input: string): Array<number> =>
  input.split("").map(n => Number(n));

export function* fftBasePattern(): Generator<number, void, unknown> {
  while (true) {
    yield 0;
    yield 1;
    yield 0;
    yield -1;
  }
}

export function* drop(
  iterable: Iterable<number>,
  n: number
): Generator<number, void, unknown> {
  let i = 0;
  for (const x of iterable) {
    if (i < n) {
      i++;
    } else {
      yield x;
    }
  }
}

export const take = (iterable: Iterable<number>, n: number): Array<number> => {
  let values: Array<number> = [];

  let i = 1;
  for (const x of iterable) {
    values.push(x);

    if (i >= n) {
      break;
    } else {
      i++;
    }
  }

  return values;
};

export function* replicateEach(
  iterable: Iterable<number>,
  n: number
): Generator<number, void, unknown> {
  for (const x of iterable) {
    for (let i = 0; i < n; i++) {
      yield x;
    }
  }
}

export const fftPattern = (index: number, length: number): Array<number> =>
  take(drop(replicateEach(fftBasePattern(), index + 1), 1), length);

export const fftMatrix = (size: number): Tensor2D => {
  let rows = [];
  for (let i = 0; i < size; i++) {
    rows.push(fftPattern(i, size));
  }

  return tensor2d(rows, [size, size], "int32");
};

export const fftPhase = (values: Array<number>): Array<number> => {
  const tValues = tensor2d(values, [values.length, 1], "int32");
  const r = mod(abs(matMul(fftMatrix(values.length), tValues)), scalar(10));

  return r.as1D().arraySync();
};

export const fftRepeatPhase = (
  values: Array<number>,
  n: number
): Array<number> => {
  const matrix = fftMatrix(values.length);
  const divisor = scalar(10);
  let tValues = tensor2d(values, [values.length, 1], "int32");

  for (let i = 0; i < n; i++) {
    tValues = mod(abs(matMul(matrix, tValues)), divisor);
  }

  return tValues.as1D().arraySync();
};

export const task1 = (): string =>
  take(fftRepeatPhase(numbersFromInput(getInput()), 100), 8).join("");
