import fs from "fs";

export const getInput = () => String(fs.readFileSync("./src/18.input.txt"));

const entrance = "@";
const empty = ".";
const wall = "#";
const visited = ":";

const getTile = (field: Array<string>, x: number, y: number): string =>
  field[y].charAt(x) || wall;

const isKey = (field: Array<string>, x: number, y: number): boolean =>
  "abcdefghijklmnopqrstuvwxyz".includes(getTile(field, x, y));

const openDoor = (
  field: Array<string>,
  x: number,
  y: number
): Array<string> => {
  const key = getTile(field, x, y);

  return field
    .join("\n")
    .replace(key.toUpperCase(), empty)
    .replace(key, empty)
    .split("\n");
};

const nextPositions = (x: number, y: number): Array<[number, number]> => [
  [x + 1, y],
  [x - 1, y],
  [x, y + 1],
  [x, y - 1]
];

export const findEntrance = (field: Array<string>): [number, number] => {
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[0].length; x++) {
      if (getTile(field, x, y) === entrance) {
        return [x, y];
      }
    }
  }

  return [NaN, NaN];
};

const isVisitable = (field: Array<string>, x: number, y: number): boolean =>
  !`${wall}${visited}`.includes(getTile(field, x, y));

const visit = (field: Array<string>, x: number, y: number): Array<string> =>
  field.map((line: string, i: number): string => {
    if (i !== y) {
      return line;
    }

    return (
      line.slice(0, Math.max(0, x)) +
      visited +
      line.slice(Math.min(line.length, x + 1), line.length)
    );
  });

const unvisit = (field: Array<string>): Array<string> =>
  field
    .join("\n")
    .replace(/:/g, empty)
    .split("\n");

export const step = (
  field: Array<string>,
  xOrigin: number,
  yOrigin: number
): Array<[Array<string>, number, number]> =>
  nextPositions(xOrigin, yOrigin)
    .filter(([x, y]) => isVisitable(field, x, y))
    .map(([x, y]): [Array<string>, number, number] => {
      if (isKey(field, x, y)) {
        return [visit(unvisit(openDoor(field, x, y)), x, y), x, y];
      }

      return [visit(field, x, y), x, y];
    });

const finished = (field: Array<string>): boolean =>
  !/[a-zA-Z]/.test(field.join("\n"));

const enter = (field: Array<string>): [Array<string>, number, number] => {
  const [x, y] = findEntrance(field);
  return [visit(field, x, y), x, y];
};

export const stepsToSolve = (initialField: Array<string>): number => {
  let states: Array<[Array<string>, number, number]> = [enter(initialField)];
  let i = 0;

  while (!states.some(([field]) => finished(field))) {
    states = states.flatMap(([field, x, y]) => step(field, x, y));
    i++;
  }

  return i;
};

export const task1 = (): number => stepsToSolve(getInput().split("\n"));
