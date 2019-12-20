import {
  numbersFromInput,
  drop,
  take,
  replicateEach,
  fftPattern,
  fftPhase,
  fftRepeatPhase,
  task1,
  fftMatrix
} from "./16";

describe("16", () => {
  describe("numbersFromInput()", () => {
    it("should parse input as expected", () => {
      expect(numbersFromInput("12345")).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("drop()", () => {
    it("should drop the first n elements", () => {
      const expected = [3, 4, 5];

      let actual = [];
      for (const x of drop([1, 2, 3, 4, 5], 2)) {
        actual.push(x);
      }

      expect(actual).toEqual(expected);
    });
  });

  describe("take()", () => {
    it("should take the first n elements", () => {
      const expected = [1, 2, 3];

      let actual = [];
      for (const x of take([1, 2, 3, 4, 5], 3)) {
        actual.push(x);
      }

      expect(actual).toEqual(expected);
    });
  });

  describe("replicateEach()", () => {
    it("should replicate each element n times", () => {
      const expected = [2, 2, 2, 3, 3, 3, 5, 5, 5];

      let actual = [];
      for (const x of replicateEach([2, 3, 5], 3)) {
        actual.push(x);
      }

      expect(actual).toEqual(expected);
    });
  });

  describe("fftPattern()", () => {
    it("should produce the desired pattern for index 0 length 4", () => {
      expect(fftPattern(0, 4)).toEqual([1, 0, -1, 0]);
    });

    it("should produce the desired pattern for index 2 length 10", () => {
      expect(fftPattern(2, 10)).toEqual([0, 0, 1, 1, 1, 0, 0, 0, -1, -1]);
    });
  });

  describe("fftMatrix()", () => {
    it("should yield the desired matrix", () => {
      const expected = [
        [1, 0, -1, 0, 1, 0, -1, 0],
        [0, 1, 1, 0, 0, -1, -1, 0],
        [0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 1]
      ];
      const actual = fftMatrix(8).arraySync();

      expect(actual).toEqual(expected);
    });
  });

  describe("fftPhase()", () => {
    it("should compute the expected first 4 phases", () => {
      const start = numbersFromInput("12345678");
      const phase1 = numbersFromInput("48226158");
      const phase2 = numbersFromInput("34040438");
      const phase3 = numbersFromInput("03415518");
      const phase4 = numbersFromInput("01029498");

      expect(fftPhase(start)).toEqual(phase1);
      expect(fftPhase(phase1)).toEqual(phase2);
      expect(fftPhase(phase2)).toEqual(phase3);
      expect(fftPhase(phase3)).toEqual(phase4);
    });
  });

  describe("fftRepeatPhase()", () => {
    const example1 = numbersFromInput("80871224585914546619083218645595");
    const example2 = numbersFromInput("19617804207202209144916044189917");
    const example3 = numbersFromInput("69317163492948606335995924319873");

    it("should yield the correct output for example1", () => {
      const expected = numbersFromInput("24176176");
      const actual = take(fftRepeatPhase(example1, 100), 8);

      expect(actual).toEqual(expected);
    });

    it("should yield the correct output for example2", () => {
      const expected = numbersFromInput("73745418");
      const actual = take(fftRepeatPhase(example2, 100), 8);

      expect(actual).toEqual(expected);
    });

    it("should yield the correct output for example3", () => {
      const expected = numbersFromInput("52432133");
      const actual = take(fftRepeatPhase(example3, 100), 8);

      expect(actual).toEqual(expected);
    });
  });

  describe("task1()", () => {
    it("should compute the correct value", () => {
      expect(task1()).toBe("52611030");
    });
  });
});
