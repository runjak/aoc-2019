import {
  findIntersections,
  scoreIntersections,
  task1,
  uncompressed,
  a,
  b,
  c,
  main,
  task2
} from "./17";

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

  describe("compression", () => {
    it("should derive uncompressed from a,b,c and main", () => {
      expect(
        main
          .replace(/A/g, a)
          .replace(/B/g, b)
          .replace(/C/g, c)
      ).toEqual(uncompressed);
    });
  });

  describe("task2()", () => {
    it("should compute the correct values", async () => {
      const actual = await task2();

      expect(actual).toBe(927809);
    });
  });
});
