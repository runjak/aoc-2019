import {
  computeAmplifiers,
  phaseSettings,
  findMaxOutput,
  mkBuffer,
  asyncComputeAmplifiers,
  asyncFindMaxOutput,
  task2
} from "./07";

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
  const asyncExample1 = JSON.parse(
    "[3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5]"
  );
  const asyncExample2 = JSON.parse(
    "[3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10]"
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

  describe("mkBuffer()", () => {
    it("should handle two pending reads correctly", async () => {
      const buffer = mkBuffer();
      const r1 = buffer.read();
      const r2 = buffer.read();

      await buffer.write(2);
      await buffer.write(3);

      const result = await Promise.all([r1, r2]);
      expect(result).toEqual([2, 3]);
    });

    it("should handle two pending writes correctly", async () => {
      const buffer = mkBuffer();

      const w1 = buffer.write(2);
      const w2 = buffer.write(3);

      const r1 = buffer.read();
      const r2 = buffer.read();

      Promise.all([w1, w2]);
      const result = await Promise.all([r1, r2]);
      expect(result).toEqual([2, 3]);
    });

    it("should handle interleaved reads and writes", async () => {
      const buffer = mkBuffer();

      const w1 = buffer.write(2);
      const r1 = buffer.read();
      const w2 = buffer.write(3);
      const r2 = buffer.read();

      const [, x, , y] = await Promise.all([w1, r1, w2, r2]);
      expect([x, y]).toEqual([2, 3]);
    });
  });

  describe("asyncComputeAmplifiers()", () => {
    it("should correctly compute asyncExample1", async () => {
      const expected = 139629729;
      const actual = await asyncComputeAmplifiers(
        asyncExample1,
        [9, 8, 7, 6, 5],
        0
      );

      expect(actual).toBe(expected);
    });

    it("should correctly compute asyncExample2", async () => {
      const expected = 18216;
      const actual = await asyncComputeAmplifiers(
        asyncExample2,
        [9, 7, 8, 5, 6],
        0
      );

      expect(actual).toBe(expected);
    });
  });

  describe("asyncFindMaxOutput()", () => {
    it("should find the correct maximum for asyncExample1", async () => {
      const expected = 139629729;
      const actual = await asyncFindMaxOutput(asyncExample1);

      expect(actual).toBe(expected);
    });

    it("should find the correct maximum for asyncExample2", async () => {
      const expected = 18216;
      const actual = await asyncFindMaxOutput(asyncExample2);

      expect(actual).toBe(expected);
    });

    it("should solve task2", async () => {
      const x = await task2();
      expect(x).toBe(33660560);
    });
  });
});
