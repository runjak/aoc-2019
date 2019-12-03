import { vec2 } from "gl-matrix";
import {
  parseSegment,
  parseSegments,
  segmentToVector,
  manhattenDistance,
  chainVectors,
  lineIntersection,
  lines,
  findIntersections,
  findClosestIntersectionDistance,
  stepsToIntersection,
  findShortestStepSumIntersection
} from "./03";

import input from "./03.input.json";

describe("03", () => {
  describe("parseSegment()", () => {
    it("should parse a valid segment", () => {
      const data = "U42";
      const expected = { direction: "U", length: 42 };

      const actual = parseSegment(data);

      expect(actual).toEqual(expected);
    });

    it("should throw on invalid segments", () => {
      expect(() => parseSegment("")).toThrow();
    });
  });

  describe("parseSegments()", () => {
    it("should correctly parse a list of segments", () => {
      const data = "R8,U5";
      const expected = [
        { direction: "R", length: 8 },
        { direction: "U", length: 5 }
      ];

      const actual = parseSegments(data);
      expect(actual).toEqual(expected);
    });
  });

  describe("segmentToVector", () => {
    it("should calculate the expected vectors", () => {
      const segments = parseSegments("R8,U5,L5,D3");
      const expected = [
        vec2.fromValues(8, 0),
        vec2.fromValues(0, 5),
        vec2.fromValues(-5, 0),
        vec2.fromValues(0, -3)
      ];

      const actual = segments.map(segmentToVector);

      expect(actual).toEqual(expected);
    });
  });

  describe("manhattenDistance()", () => {
    it("should calculate the expected distance", () => {
      const vec = vec2.fromValues(-3, 3);
      const expected = 6;

      expect(manhattenDistance(vec)).toBe(expected);
    });
  });

  describe("chainVectors()", () => {
    it("should calculate the expected absolute vectors", () => {
      const input = [
        vec2.fromValues(1, 0),
        vec2.fromValues(0, -3),
        vec2.fromValues(-2, 5)
      ];
      const expected = [
        vec2.fromValues(1, 0),
        vec2.fromValues(1, -3),
        vec2.fromValues(-1, 2)
      ];

      expect(chainVectors(input)).toEqual(expected);
    });
  });

  describe("lineIntersection()", () => {
    it("should return null when lines are parallel", () => {
      const l1 = [vec2.fromValues(0, 1), vec2.fromValues(1, 1)];
      const l2 = [vec2.fromValues(0, 2), vec2.fromValues(1, 2)];

      expect(lineIntersection(l1, l2)).toBeNull();
    });

    it("should return the intersection points for orthogonally intersecting lines", () => {
      const l1 = [vec2.fromValues(0, -1), vec2.fromValues(0, 2)];
      const l2 = [vec2.fromValues(-1, 1), vec2.fromValues(2, 1)];

      const expected = vec2.fromValues(0, 1);
      const actual = lineIntersection(l1, l2);

      expect(actual).toEqual(expected);
    });

    it("should not find an invalid example", () => {
      const l1 = [vec2.fromValues(0, 0), vec2.fromValues(8, 0)];
      const l2 = [vec2.fromValues(6, 7), vec2.fromValues(6, 3)];

      expect(lineIntersection(l1, l2)).toBeNull();
    });
  });

  describe("lines()", () => {
    it("should give the lines from a chain of vectors", () => {
      const chain = [
        vec2.fromValues(0, 1),
        vec2.fromValues(1, 1),
        vec2.fromValues(1, 3)
      ];

      const expected = [
        [vec2.fromValues(0, 0), chain[0]],
        [chain[0], chain[1]],
        [chain[1], chain[2]]
      ];
      const actual = lines(chain);

      expect(actual).toEqual(expected);
    });
  });

  describe("findIntersections()", () => {
    it("should find the intersections from example 1", () => {
      const s1 = "R8,U5,L5,D3";
      const s2 = "U7,R6,D4,L4";

      const expected = [vec2.fromValues(6, 5), vec2.fromValues(3, 3)];
      const actual = findIntersections(s1, s2);

      expect(actual).toEqual(expected);
    });

    it("should find the intersections from example 2", () => {
      const s1 = "R75,D30,R83,U83,L12,D49,R71,U7,L72";
      const s2 = "U62,R66,U55,R34,D71,R55,D58,R83";

      const expected = [
        vec2.fromValues(158, -12),
        vec2.fromValues(146, 46),
        vec2.fromValues(155, 4),
        vec2.fromValues(155, 11)
      ];
      const actual = findIntersections(s1, s2);

      expect(actual).toEqual(expected);
    });

    it("should find the intersections from example 3", () => {
      const s1 = "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51";
      const s2 = "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7";

      const expected = [
        vec2.fromValues(107, 47),
        vec2.fromValues(124, 11),
        vec2.fromValues(157, 18),
        vec2.fromValues(107, 71),
        vec2.fromValues(107, 51)
      ];
      const actual = findIntersections(s1, s2);

      expect(actual).toEqual(expected);
    });
  });

  describe("findClosestIntersectionDistance()", () => {
    it("should produce the solution for example 1", () => {
      const s1 = "R8,U5,L5,D3";
      const s2 = "U7,R6,D4,L4";

      const expected = 6;
      const actual = findClosestIntersectionDistance(s1, s2);

      expect(actual).toBe(expected);
    });

    it("should produce the solution for example 2", () => {
      const s1 = "R75,D30,R83,U83,L12,D49,R71,U7,L72";
      const s2 = "U62,R66,U55,R34,D71,R55,D58,R83";

      const expected = 159;
      const actual = findClosestIntersectionDistance(s1, s2);

      expect(actual).toBe(expected);
    });

    it("should produce the solution for example 3", () => {
      const s1 = "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51";
      const s2 = "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7";

      const expected = 135;
      const actual = findClosestIntersectionDistance(s1, s2);

      expect(actual).toBe(expected);
    });
  });

  describe("stepsToIntersection()", () => {
    it("compute the correct number of steps for the line with intersection", () => {
      const lines = [[vec2.fromValues(0, 0), vec2.fromValues(0, 5)]];
      const intersection = vec2.fromValues(0, 3);

      expect(stepsToIntersection(lines, intersection)).toBe(3);
    });

    it("should compute the sum of line lengths for an unreached intersection", () => {
      const lines = [
        [vec2.fromValues(0, 0), vec2.fromValues(0, 5)],
        [vec2.fromValues(0, 5), vec2.fromValues(0, 7)],
        [vec2.fromValues(0, 7), vec2.fromValues(0, 11)]
      ];
      const intersection = vec2.fromValues(1, 1);

      expect(stepsToIntersection(lines, intersection)).toBe(11);
    });

    it("should correctly handle the combined case", () => {
      const lines = [
        [vec2.fromValues(0, 0), vec2.fromValues(0, 5)],
        [vec2.fromValues(0, 5), vec2.fromValues(0, 7)],
        [vec2.fromValues(0, 7), vec2.fromValues(0, 11)]
      ];
      const intersection = vec2.fromValues(0, 9);

      expect(stepsToIntersection(lines, intersection)).toBe(9);
    });

    it("should not compute a short number of steps for an off-line intersection", () => {
      const lines = [[vec2.fromValues(0, 0), vec2.fromValues(0, 5)]];
      const intersection = vec2.fromValues(3, 0);

      expect(stepsToIntersection(lines, intersection)).toBe(5);
    });

    it("should not be fooled by an intersection outside the line but in the same direction", () => {
      const lines = [[vec2.fromValues(0, 0), vec2.fromValues(5, 0)]];
      const intersection = vec2.fromValues(-1, 0);

      expect(stepsToIntersection(lines, intersection)).toBe(5);
    });
  });

  describe("findShortestStepSumIntersection()", () => {
    it("should correctly compute example 1", () => {
      const s1 = "R8,U5,L5,D3";
      const s2 = "U7,R6,D4,L4";

      const expected = 30;
      const actual = findShortestStepSumIntersection(s1, s2);

      expect(actual).toBe(expected);
    });

    it("should correctly compute example 2", () => {
      const s1 = "R75,D30,R83,U83,L12,D49,R71,U7,L72";
      const s2 = "U62,R66,U55,R34,D71,R55,D58,R83";

      const expected = 610;
      const actual = findShortestStepSumIntersection(s1, s2);

      expect(actual).toBe(expected);
    });

    it("should correctly compute example 3", () => {
      const s1 = "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51";
      const s2 = "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7";

      const expected = 410;
      const actual = findShortestStepSumIntersection(s1, s2);

      expect(actual).toBe(expected);
    });

    it("should not be too small", () => {
      const lowerBound = 678;
      const actual = findShortestStepSumIntersection(input[0], input[1]);

      expect(actual).toBeGreaterThan(lowerBound);
    });
  });
});
