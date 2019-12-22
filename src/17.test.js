import { findIntersections, scoreIntersections, task1 } from "./17";

describe("17", () => {
  const example = [
    "..#..........",
    "..#..........",
    "#######...###",
    "#.#...#...#.#",
    "#############",
    "..#...#...#..",
    "..#####...^.."
  ].join("\n");

  describe("findIntersections()", () => {
    it("should find the intersections from the example", () => {
      const expected = [
        [2, 2],
        [2, 4],
        [6, 4],
        [10, 4]
      ];
      const actual = findIntersections(example);

      expect(actual).toEqual(expected);
    });
  });

  describe("scoreIntersections()", () => {
    it("should score the example as expected", () => {
      const actual = scoreIntersections(findIntersections(example));

      expect(actual).toBe(76);
    });
  });

  describe("task1()", () => {
    it("should return the correct value", async () => {
      const actual = await task1();

      expect(actual).toBe(3888);
    });
  });
});
