import unzip from "lodash/unzip";

import { Memory } from "./05";
import { mkState, execute, State } from "./09";

import input from "./15.input.json";
import { isProduction, withKeypress } from "./process";

export type Position = [number, number];

export const toPosition = (s: string): Position => JSON.parse(s);
export const fromPosition = (p: Position): string => JSON.stringify(p);

export enum Direction {
  north = 1,
  south = 2,
  west = 3,
  east = 4
}

const directions: Array<Direction> = [
  Direction.north,
  Direction.south,
  Direction.west,
  Direction.east
];

export const movePosition = ([x, y]: Position, d: Direction): Position => {
  switch (d) {
    default:
    case Direction.north:
      return [x, y + 1];
    case Direction.south:
      return [x, y - 1];
    case Direction.west:
      return [x - 1, y];
    case Direction.east:
      return [x + 1, y];
  }
};

export enum Response {
  wall = 0,
  empty = 1,
  oxygen = 2
}

export type Panel = { [key: string]: Response };

export const cloneState = ({ memory, pc, relativeBase }: State): State => ({
  memory: [...memory],
  pc,
  relativeBase
});

type SearchState = {
  positionedStates: Array<[State, Position]>;
  panel: Panel;
};

export const mkSearchState = (program: Memory): SearchState => {
  const start: Position = [0, 0];

  return {
    panel: {
      [fromPosition(start)]: Response.empty
    },
    positionedStates: [[mkState(program), start]]
  };
};

export const stateForMove = (
  oldState: State,
  direction: Direction
): Promise<[State, Response]> => {
  const state = cloneState(oldState);

  return new Promise(async resolve => {
    let hasStdIn = false;

    try {
      await execute(
        state,
        async () => {
          if (hasStdIn) {
            throw new Error("no duplicate StdIn permitted");
          }

          hasStdIn = true;
          return direction;
        },
        async (response: number) => {
          hasStdIn && resolve([cloneState(state), response]);
        }
      );
    } catch (e) {}
  });
};

export const nextMoves = ({
  positionedStates,
  panel
}: SearchState): Array<[State, Position, Direction]> => {
  const visitedPositions = new Set(Object.keys(panel));

  return positionedStates
    .filter(([, position]) => panel[fromPosition(position)] !== Response.wall)
    .flatMap(
      ([state, position]: [State, Position]): Array<
        [State, Position, Direction]
      > =>
        directions
          .map((direction: Direction): [State, Position, Direction] => [
            state,
            movePosition(position, direction),
            direction
          ])
          .filter(
            ([, position]) => !visitedPositions.has(fromPosition(position))
          )
    );
};

export const searchStep = async (
  searchState: SearchState
): Promise<SearchState> => {
  const panel = { ...searchState.panel };

  const positionedStates = await Promise.all(
    nextMoves(searchState).map(
      async ([state, position, direction]: [
        State,
        Position,
        Direction
      ]): Promise<[State, Position]> => {
        const [nextState, response] = await stateForMove(state, direction);
        panel[fromPosition(position)] = response;
        return [nextState, position];
      }
    )
  );

  return { panel, positionedStates };
};

export const task1 = async (): Promise<number> => {
  let searchState = mkSearchState(input);
  let i = 0;

  while (!Object.values(searchState.panel).includes(Response.oxygen)) {
    searchState = await searchStep(searchState);
    i++;
  }

  return i;
};

export const completePanel = async (
  searchState: SearchState
): Promise<Panel> => {
  while (nextMoves(searchState).length > 0) {
    searchState = await searchStep(searchState);
  }

  return searchState.panel;
};

export const fromResponse = (response: Response): string => {
  switch (response) {
    default:
    case Response.empty:
      return " ";
    case Response.wall:
      return "#";
    case Response.oxygen:
      return "O";
  }
};

export const fromPanel = (panel: Panel): string => {
  // @ts-ignore type known by higher reasoning
  const [xs, ys]: [Array<number>, Array<number>] = unzip(
    Object.keys(panel).map(key => JSON.parse(key))
  );

  const xMin = Math.min(...xs);
  const yMin = Math.min(...ys);
  const xMax = Math.max(...xs);
  const yMax = Math.max(...ys);

  let lines: Array<string> = [];
  for (let x = xMin; x <= xMax; x++) {
    let line: Array<string> = [];
    for (let y = yMin; y <= yMax; y++) {
      const response = panel[fromPosition([x, y])] || Response.wall;
      line.push(x === 0 && y === 0 ? "x" : fromResponse(response));
    }

    lines.push(line.join(""));
  }

  return lines.join("\n");
};

if (isProduction()) {
  withKeypress(() => {});

  (async () => {
    const panel = await completePanel(mkSearchState(input));

    console.log(fromPanel(panel));

    process.exit(0);
  })();
}
