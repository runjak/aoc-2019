import { mkState, execute, StdOut } from "./09";

import input from "./13.input.json";
import { mkBuffer } from "./07";
import { isProduction, withKeypress } from "./process";
import unzip from "lodash/unzip";

type Panel = { [key: string]: number };

export const panelSet = (
  panel: Panel,
  x: number,
  y: number,
  v: number
): void => {
  panel[JSON.stringify([x, y])] = v;
};

enum Tile {
  empty = 0,
  wall = 1,
  block = 2,
  horizontal_paddle = 3,
  ball = 4
}

export const panelWriter = (
  panel: Panel,
  set: typeof panelSet = panelSet
): StdOut => {
  let buffer: Array<number> = [];

  return async (n: number) => {
    buffer.push(n);

    if (buffer.length >= 3) {
      const x = buffer.shift() || 0;
      const y = buffer.shift() || 0;
      const z = buffer.shift() || 0;

      set(panel, x, y, z);
    }
  };
};

export const task1 = async (): Promise<number> => {
  let panel: Panel = {};

  await execute(
    mkState(input),
    () => {
      throw new Error("unexpected read");
    },
    panelWriter(panel)
  );

  return Object.values(panel).filter(tileId => tileId === Tile.block).length;
};

export const renderPanel = (
  panel: Panel,
  mapTile: (tileId: number) => string
): string => {
  const [xs, ys] = unzip(
    Object.keys(panel).map((key: string): [number, number] => JSON.parse(key))
  );

  const xMax = Math.max(...xs);
  const yMax = Math.max(...ys);

  const lines: Array<string> = [];

  for (let y = 0; y <= yMax; y++) {
    let line: Array<string> = [];

    for (let x = 0; x <= xMax; x++) {
      const tileId = panel[JSON.stringify([x, y])] || 0;

      line.push(mapTile(tileId));
    }

    lines.push(line.join(""));
  }

  return lines.join(`\n`);
};

const getCoordinates = (panel: Panel, tileId: number): [number, number] => {
  const entry = Object.entries(panel).find(([, t]) => t === tileId);

  return entry ? JSON.parse(entry[0]) : [NaN, NaN];
};

const aim = (panel: Panel): number => {
  const [xBall] = getCoordinates(panel, 4);
  const [xPaddle] = getCoordinates(panel, 3);

  return Math.sign(xBall - xPaddle);
};

export const task2 = async (): Promise<void> => {
  let panel: Panel = {};
  let state = mkState(input);
  state.memory[0] = 2;

  const inputBuffer = mkBuffer();

  withKeypress((str: string) => {
    if (str === "a") {
      inputBuffer.write(-1);
    } else if (str === "d") {
      inputBuffer.write(1);
    } else if (str === "x") {
      inputBuffer.write(aim(panel));
    } else {
      inputBuffer.write(0);
    }
  });

  console.log("starting game…");

  await execute(
    state,
    inputBuffer.read,
    panelWriter(panel, (panel: Panel, x: number, y: number, v: number) => {
      panelSet(panel, x, y, v);
      console.log(
        renderPanel(panel, (n: number): string => {
          switch (n) {
            case 1:
              return "=";
            case 2:
              return "#";
            case 3:
              return "-";
            case 4:
              return "O";
            case 0:
            default:
              return " ";
          }
        })
      );
    })
  );

  console.log("final score:", panel[JSON.stringify([-1, 0])]);

  process.exit(0);
};

if (isProduction()) {
  task2();
}
