import sum from "lodash/sum";

import { Memory } from "./05";
import { mkState, execute } from "./09";
import { isProduction, withKeypress } from "./process";

import input from "./17.input.json";

export const gatherOutput = async (code: Memory): Promise<string> => {
  let output = "";

  try {
    await execute(
      mkState(code),
      () => {
        throw new Error("no input possible");
      },
      async n => {
        output += String.fromCharCode(n);
      }
    );
  } catch (e) {}

  return output;
};

const neighbours = (x: number, y: number): Array<[number, number]> => [
  [x + 1, y],
  [x - 1, y],
  [x, y + 1],
  [x, y - 1]
];

const getChar = (lines: Array<string>, x: number, y: number): string =>
  (lines[y] || "").charAt(x);

const isScaffold = (field: string): boolean => field === "#";

export const findIntersections = (data: string): Array<[number, number]> => {
  const lines = data.split("\n");
  let intersections: Array<[number, number]> = [];

  for (let y = 1; y < lines.length - 1; y++) {
    for (let x = 1; x < lines[0].length - 1; x++) {
      if (isScaffold(getChar(lines, x, y))) {
        const isIntersection = neighbours(x, y).every(([nx, ny]) =>
          isScaffold(getChar(lines, nx, ny))
        );

        if (isIntersection) {
          intersections.push([x, y]);
        }
      }
    }
  }

  return intersections;
};

export const scoreIntersections = (
  intersections: Array<[number, number]>
): number => sum(intersections.map(([x, y]) => x * y));

export const task1 = async (): Promise<number> => {
  const output = await gatherOutput(input);

  return scoreIntersections(findIntersections(output));
};

if (isProduction()) {
  console.log("Hi <3><");
  withKeypress(() => {});
  (async () => {
    const output = await gatherOutput(input);
    console.log(output);
    process.exit(0);
  })();
}
