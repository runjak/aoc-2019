import {
  getParents,
  toMap,
  indirectOrbits,
  countOrbits,
  findClosestParent,
  connectingNodes,
  countTransfers
} from "./06";

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

  const example2 = [
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
    ["K", "L"],
    ["K", "YOU"],
    ["I", "SAN"]
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

  describe("findClosestParent()", () => {
    it("should find the closest parent for two children from the example", () => {
      const closestParent = findClosestParent(indirectOrbits(toMap(example)), [
        "I",
        "L"
      ]);

      expect(closestParent).toBe("D");
    });
  });

  describe("connectingNodes()", () => {
    it("should compute the connecting nodes for the example", () => {
      const expected = ["D", "E", "J", "K"];
      const actual = connectingNodes(toMap(example), ["I", "L"]);

      expect(actual).toEqual(expected);
    });

    it("should compute the connecting nodes for example2", () => {
      const expected = ["D", "E", "J", "K", "I"];
      const actual = connectingNodes(toMap(example2), ["YOU", "SAN"]);

      expect(actual).toEqual(expected);
    });
  });

  describe("countTransfers()", () => {
    it("should count example2 as desired", () => {
      expect(countTransfers(toMap(example2), "YOU", "SAN")).toBe(4);
    });
  });
});
