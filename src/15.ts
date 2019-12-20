import zip from "lodash/zip";

import { Memory } from "./05";
import { mkState, execute, State } from "./09";

import input from "./15.input.json";

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

  return new Promise(resolve => {
    let hasStdIn = false;

    execute(
      state,
      async () => {
        hasStdIn = true;
        return direction;
      },
      async (response: number) => {
        hasStdIn && resolve([cloneState(state), response]);
      }
    );
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
