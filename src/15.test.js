import { mkState } from "./09";
import {
  Direction,
  mkSearchState,
  stateForMove,
  nextMoves,
  searchStep,
  task1
} from "./15";

describe("15", () => {
  describe("mkSearchState()", () => {
    it("should initialize the SearchState as desired", () => {
      const expected = {
        panel: { "[0,0]": 1 },
        positionedStates: [[mkState([2, 3, 5, 7, 11]), [0, 0]]]
      };

      expect(mkSearchState([2, 3, 5, 7, 11])).toEqual(expected);
    });
  });

  describe("stateForMove()", () => {
    it("should compute the expected output", async () => {
      const program = [3, 7, 4, 7, 5, 0, 0];

      const expected = [
        { memory: [...program, Direction.north], pc: 2, relativeBase: 0 },
        Direction.north
      ];

      const actual = await stateForMove(mkState(program), Direction.north);

      expect(actual).toEqual(expected);
    });
  });

  describe("nextMoves()", () => {
    it("should compute the expected next moves", () => {
      const state = mkState([2, 3, 5, 7, 11]);
      const searchState = {
        panel: { "[0,0]": 1, "[1,0]": 2, "[2,0]": 0 },
        positionedStates: [
          [state, [0, 0]],
          [state, [1, 0]],
          [state, [2, 0]]
        ]
      };

      const expected = [
        [state, [0, 1], 1],
        [state, [0, -1], 2],
        [state, [-1, 0], 3],
        [state, [1, 1], 1],
        [state, [1, -1], 2]
      ];

      expect(nextMoves(searchState)).toEqual(expected);
    });
  });

  describe("searchStep()", () => {
    it("should perform the expected search", async () => {
      const program = [3, 7, 4, 7, 5, 0, 0];
      const initialSearchState = mkSearchState(program);

      const expected = {
        panel: {
          "[0,0]": 1,
          "[0,1]": 1,
          "[0,-1]": 2,
          "[-1,0]": 3,
          "[1,0]": 4
        },
        positionedStates: [
          [{ pc: 2, relativeBase: 0, memory: [...program, 1] }, [0, 1]],
          [{ pc: 2, relativeBase: 0, memory: [...program, 2] }, [0, -1]],
          [{ pc: 2, relativeBase: 0, memory: [...program, 3] }, [-1, 0]],
          [{ pc: 2, relativeBase: 0, memory: [...program, 4] }, [1, 0]]
        ]
      };
      const actual = await searchStep(initialSearchState);

      expect(actual).toEqual(expected);
    });
  });

  describe("task1()", () => {
    it("should not be too high", async () => {
      const value = await task1();
      expect(value).toBeLessThan(3546494377);
    });

    it("should not compute the correct value", async () => {
      const value = await task1();
      expect(value).toBe(354);
    });
  });
});
