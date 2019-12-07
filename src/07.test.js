import { computeAmplifiers, phaseSettings, findMaxOutput } from "./07";

describe("07", () => {
  const example1 = JSON.parse(
    "[3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0]"
  );
  const example2 = JSON.parse(
    "[3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0]"
  );
  const example3 = JSON.parse(
    "[3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0]"
  );

  describe("computeAmplifiers()", () => {
    it("should compute example1", () => {
      const phases = [4, 3, 2, 1, 0];
      const expected = 43210;

      expect(computeAmplifiers(example1, phases, 0)).toBe(expected);
    });

    it("should compute example2", () => {
      const phases = [0, 1, 2, 3, 4];
      const expected = 54321;

      expect(computeAmplifiers(example2, phases, 0)).toBe(expected);
    });

    it("should compute example3", () => {
      const phases = [1, 0, 4, 3, 2];
      const expected = 65210;

      expect(computeAmplifiers(example3, phases, 0)).toBe(expected);
    });
  });

  describe("phaseSettings()", () => {
    it("should compute phase settings as expected", () => {
      const expected = [
        [0, 1, 2],
        [0, 2, 1],
        [1, 0, 2],
        [1, 2, 0],
        [2, 0, 1],
        [2, 1, 0]
      ];
      const actual = phaseSettings("012");

      expect(actual).toEqual(expected);
    });
  });

  describe("findMaxOutput()", () => {
    it("should compute example1", () => {
      const expected = 43210;

      expect(findMaxOutput(example1)).toBe(expected);
    });

    it("should compute example2", () => {
      const expected = 54321;

      expect(findMaxOutput(example2)).toBe(expected);
    });

    it("should compute example3", () => {
      const expected = 65210;

      expect(findMaxOutput(example3)).toBe(expected);
    });
  });
});
