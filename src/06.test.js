import { getParents, toMap, indirectOrbits, countOrbits } from "./06";

describe("06", () => {
  const example = [
    ["COM", "B"],
    ["B", "C"],
    ["C", "D"],
    ["D", "E"],
    ["E", "F"],
    ["B", "G"],
    ["G", "H"],
    ["D", "I"],
    ["E", "J"],
    ["J", "K"],
    ["K", "L"]
  ];

  describe("toMap()", () => {
    it("should produce the desired example map", () => {
      const expected = {
        B: ["C", "G"],
        C: ["D"],
        COM: ["B"],
        D: ["E", "I"],
        E: ["F", "J"],
        G: ["H"],
        J: ["K"],
        K: ["L"]
      };

      expect(toMap(example)).toEqual(expected);
    });
  });

  describe("getParents()", () => {
    it("should return the leafs from the example", () => {
      expect(getParents(toMap(example))).toEqual(["COM"]);
    });
  });

  describe("indirectOrbits()", () => {
    it("should compute the indirect orbits for the example", () => {
      const expected = {
        B: ["C", "G", "D", "H", "E", "I", "F", "J", "K", "L"],
        C: ["D", "E", "I", "F", "J", "K", "L"],
        COM: ["B", "C", "G", "D", "H", "E", "I", "F", "J", "K", "L"],
        D: ["E", "I", "F", "J", "K", "L"],
        E: ["F", "J", "K", "L"],
        G: ["H"],
        J: ["K", "L"],
        K: ["L"]
      };

      expect(indirectOrbits(toMap(example))).toEqual(expected);
    });
  });

  describe("countOrbits()", () => {
    it("should correctly count the example", () => {
      expect(countOrbits(toMap(example))).toBe(42);
    });
  });
});
