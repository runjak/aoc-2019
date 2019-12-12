import range from "lodash/range";
import {
  mkAsteroid,
  parseAsteroids,
  angles,
  walkAngles,
  visibillityMap,
  maxAsteroid,
  task1,
  circle
} from "./10";

describe("10", () => {
  const example1 = [".#..#", ".....", "#####", "....#", "...##"];

  describe("parseAsteroids()", () => {
    it("should produce the desired result", () => {
      const expected = [
        [null, mkAsteroid(0, 1, "#"), null, null, mkAsteroid(0, 4, "#")],
        [null, null, null, null, null],
        range(5).map(y => mkAsteroid(2, y, "#")),
        [null, null, null, null, mkAsteroid(3, 4, "#")],
        [null, null, null, mkAsteroid(4, 3, "#"), mkAsteroid(4, 4, "#")]
      ];
      const actual = parseAsteroids(example1);

      expect(actual).toEqual(expected);
    });
  });

  describe("angles()", () => {
    it("should generate the expected angles for a field", () => {
      const field = [
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4]
      ];

      const expected = [
        [0, 1],
        [1, -4],
        [1, -3],
        [1, -2],
        [1, -1],
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [2, -3],
        [2, -1],
        [2, 1],
        [2, 3],
        [3, -4],
        [3, -2],
        [3, -1],
        [3, 1],
        [3, 2],
        [3, 4],
        [4, -3],
        [4, -1],
        [4, 1],
        [4, 3]
      ];

      expect(angles(field)).toEqual(expected);
    });
  });

  describe("visibillityMap()", () => {
    it("should compute the example visibility map for walking all angles", () => {
      const field = parseAsteroids(example1);

      walkAngles(angles(field), field);

      const expected = [
        [0, 7, 0, 0, 7],
        [0, 0, 0, 0, 0],
        [6, 7, 7, 7, 5],
        [0, 0, 0, 0, 7],
        [0, 0, 0, 8, 7]
      ];
      const actual = visibillityMap(field);

      expect(actual).toEqual(expected);
    });
  });

  describe("maxAsteroid()", () => {
    it("should compute field1 as expected", () => {
      const field1 = [
        "......#.#.",
        "#..#.#....",
        "..#######.",
        ".#.#.###..",
        ".#..#.....",
        "..#....#.#",
        "#..#....#.",
        ".##.#..###",
        "##...#..#.",
        ".#....####"
      ];
      const expected = { x: 8, y: 5, visible: 33 };
      const actual = maxAsteroid(parseAsteroids(field1));

      expect(actual).toEqual(expected);
    });

    it("should compute field2 as expected", () => {
      const field2 = [
        "#.#...#.#.",
        ".###....#.",
        ".#....#...",
        "##.#.#.#.#",
        "....#.#.#.",
        ".##..###.#",
        "..#...##..",
        "..##....##",
        "......#...",
        ".####.###."
      ];
      const expected = { x: 2, y: 1, visible: 35 };
      const actual = maxAsteroid(parseAsteroids(field2));

      expect(actual).toEqual(expected);
    });

    it("should compute field3 as expected", () => {
      const field3 = [
        ".#..#..###",
        "####.###.#",
        "....###.#.",
        "..###.##.#",
        "##.##.#.#.",
        "....###..#",
        "..#.#..#.#",
        "#..#.#.###",
        ".##...##.#",
        ".....#.#.."
      ];
      const expected = { x: 3, y: 6, visible: 41 };
      const actual = maxAsteroid(parseAsteroids(field3));

      expect(actual).toEqual(expected);
    });

    it("should compute field4 as expected", () => {
      const field4 = [
        ".#..##.###...#######",
        "##.############..##.",
        ".#.######.########.#",
        ".###.#######.####.#.",
        "#####.##.#.##.###.##",
        "..#####..#.#########",
        "####################",
        "#.####....###.#.#.##",
        "##.#################",
        "#####.##.###..####..",
        "..######..##.#######",
        "####.##.####...##..#",
        ".#####..#.######.###",
        "##...#.##########...",
        "#.##########.#######",
        ".####.#.###.###.#.##",
        "....##.##.###..#####",
        ".#.#.###########.###",
        "#.#.#.#####.####.###",
        "###.##.####.##.#..##"
      ];
      const expected = { x: 13, y: 11, visible: 210 };
      const actual = maxAsteroid(parseAsteroids(field4));

      expect(actual).toEqual(expected);
    });
  });

  describe("task1()", () => {
    it("should compute the correct solution", () => {
      expect(task1()).toBe(267);
    });
  });

  describe("circle()", () => {
    it("should compute the angles for a circle in the desired order", () => {
      const field = [
        [null, null],
        [null, null]
      ];
      const expected = [
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1]
      ];

      expect(circle(field)).toEqual(expected);
    });
  });
});
