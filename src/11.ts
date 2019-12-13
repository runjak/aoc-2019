import { Memory } from "./05";
import { mkState, execute } from "./09";

import input from "./11.input.json";

export enum Direction {
  Up = "^",
  Left = "<",
  Down = "v",
  Right = ">"
}

export const turn = (direction: Direction, x: number): Direction => {
  switch (direction) {
    case Direction.Up:
      return x === 0 ? Direction.Left : Direction.Right;
    case Direction.Left:
      return x === 0 ? Direction.Down : Direction.Up;
    case Direction.Down:
      return x === 0 ? Direction.Right : Direction.Left;
    case Direction.Right:
      return x === 0 ? Direction.Up : Direction.Down;
  }
};

export type Position = [number, number];

export const move = ([x, y]: Position, direction: Direction): Position => {
  switch (direction) {
    case Direction.Up:
      return [x, y + 1];
    case Direction.Left:
      return [x - 1, y];
    case Direction.Down:
      return [x, y - 1];
    case Direction.Right:
      return [x + 1, y];
  }
};

type Panel = { [key: string]: number };

type Robot = {
  direction: Direction;
  position: Position;
  panel: Panel;
};

export const mkRobot = (): Robot => ({
  direction: Direction.Up,
  position: [0, 0],
  panel: {}
});

export const paintPanel = ({ position, panel }: Robot, color: number) =>
  (panel[position.join(",")] = color);

export const watchPanel = ({ position, panel }: Robot): number =>
  panel[position.join(",")] || 0;

export const paint = async (program: Memory): Promise<Robot> => {
  const robot = mkRobot();
  let rState = 0;

  await execute(
    mkState(program),
    async () => watchPanel(robot),
    async (command: number) => {
      if (rState === 0) {
        paintPanel(robot, command);

        rState = 1;
      } else {
        robot.direction = turn(robot.direction, command);
        robot.position = move(robot.position, robot.direction);

        rState = 0;
      }
    }
  );

  return robot;
};

export const countPanelFields = ({ panel }: Robot): number =>
  Object.keys(panel).length;

export const task1 = async () => {
  const robot = await paint(input);

  return countPanelFields(robot);
};
