import { range, normalizeRange, countPermutations } from "./04";

describe("04", () => {
  describe("normalizeRange()", () => {
    it("should normalize a range as expected", () => {
      const expected = [
        [1, 2, 8, 8, 9, 9],
        [6, 4, 3, 2, 8, 1]
      ];
      const actual = normalizeRange(range);

      expect(actual).toEqual(expected);
    });
  });

  describe("countPermutations()", () => {
    it("should count an empty range", () => {
      const range = [[], []];

      expect(countPermutations(range)).toBe(1);
    });

    it("should count a singular range", () => {
      const range = [[5], [9]];

      expect(countPermutations(range)).toBe(5);
    });

    it("should count a narrow two sized range", () => {
      const range = [
        [5, 5],
        [6, 9]
      ];

      expect(countPermutations(range)).toBe(9);
    });

    it("should count a wide two sided range", () => {
      const range = [
        [0, 0],
        [9, 9]
      ];

      const expected = 10 + 9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1;

      expect(countPermutations(range)).toBe(expected);
    });
  });
});
