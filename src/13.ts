import { mkState, execute, StdOut } from "./09";

import input from "./13.input.json";

type Panel = { [key: string]: number };

export const panelRender = (panel: Panel) => (
  x: number,
  y: number,
  v: number
) => (panel[JSON.stringify([x, y])] = v);

enum Tile {
  empty = 0,
  wall = 1,
  block = 2,
  horizontal_paddle = 3,
  ball = 4
}

export const panelWriter = (panel: Panel): StdOut => {
  let buffer = [];

  return async (n: number) => {
    buffer.push(n);

    if (buffer.length >= 3) {
      panelRender(panel)(buffer.shift(), buffer.shift(), buffer.shift());
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
