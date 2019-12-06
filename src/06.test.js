import { tensor2d, tensor1d } from "@tensorflow/tfjs-node";
import {
  mkGraph,
  directOrbits,
  transition,
  transitions,
  countOrbits
} from "./06";

describe("06", () => {
  const exampleInput = [
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

  describe("mkGraph()", () => {
    it("should create the expected example Graph", async () => {
      const expectedLabeling = {
        COM: 0,
        B: 1,
        C: 2,
        D: 3,
        E: 4,
        F: 5,
        G: 6,
        H: 7,
        I: 8,
        J: 9,
        K: 10,
        L: 11
      };
      const expectedAdjacencyMatrix = tensor2d(
        [
          //  B  C  D  E  F  G  H  I  J  K  L
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // COM
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // B
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // C
          [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // D
          [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // E
          [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // F
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // G
          [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], // H
          [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // I
          [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // J
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], // K
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0] // L
        ],
        [12, 12],
        "int32"
      );

      const { labeling, labelCount, adjacencyMatrix } = mkGraph(exampleInput);

      expect(labeling).toEqual(expectedLabeling);
      expect(labelCount).toBe(12);

      const [a, b] = await Promise.all([
        adjacencyMatrix.data(),
        expectedAdjacencyMatrix.data()
      ]);
      expect(a).toEqual(b);
    });
  });

  describe("directOrbits()", () => {
    it("should compute the correct number of direct orbits in the example", async () => {
      const expected = tensor1d([11], "int32");
      const orbits = directOrbits(mkGraph(exampleInput));

      const [a, b] = await Promise.all([orbits.data(), expected.data()]);
      expect(a).toEqual(b);
    });
  });

  describe("transition()", () => {
    it("should provide the expected adjacencyMatrix for the example after one transition", async () => {
      const expectedAdjacencyMatrix = tensor2d(
        [
          //  B  C  D  E  F  G  H  I  J  K  L
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // COM
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // B
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // C
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // D
          [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // E
          [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // F
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // G
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // H
          [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // I
          [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // J
          [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // K
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0] // L
        ],
        [12, 12],
        "int32"
      );
      const adjacencyMatrix = transition(mkGraph(exampleInput).adjacencyMatrix);

      const [a, b] = await Promise.all([
        adjacencyMatrix.data(),
        expectedAdjacencyMatrix.data()
      ]);
      expect(a).toEqual(b);
    });
  });

  describe("transitions()", () => {
    it("should compute the expected number of transitions", () => {
      const graphs = transitions(mkGraph(exampleInput).adjacencyMatrix);

      expect(graphs.length).toBe(7);
    });
  });

  describe("countOrbits()", () => {
    it("should count the example number of orbits", () => {
      const count = countOrbits(mkGraph(exampleInput)).dataSync()[0];
      expect(count).toBe(42);
    });
  });
});
