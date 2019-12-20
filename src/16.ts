import fs from "fs";
import zipWith from "lodash/zipWith";
import sum from "lodash/sum";

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

// This could more beautifully be a matrix multiplication
export const fftPhase = (values: Array<number>): Array<number> =>
  values.map((_: number, index: number): number => {
    const pattern = fftPattern(index, values.length);

    return (
      Math.abs(
        sum(zipWith(values, pattern, (x: number, y: number): number => x * y))
      ) % 10
    );
  });

export const fftRepeatPhase = (
  values: Array<number>,
  n: number
): Array<number> => {
  for (let i = 0; i < n; i++) {
    values = fftPhase(values);
  }

  return values;
};

export const task1 = (): string =>
  take(fftRepeatPhase(numbersFromInput(getInput()), 100), 8).join("");
