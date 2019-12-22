import {
  numbersFromInput,
  fftPhase,
  fftRepeatPhase,
  task1,
  fftMatrix,
  fftRealComputation,
  mkPattern
} from "./16";

describe("16", () => {
  describe("numbersFromInput()", () => {
    it("should parse input as expected", () => {
      expect(numbersFromInput("12345").arraySync()).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("mkPattern()", () => {
    it("should produce the desired pattern for n=1, length=4", () => {
      expect(mkPattern(1, 4).arraySync()).toEqual([1, 0, -1, 0]);
    });

    it("should produce the desired pattern for index=3, length=10", () => {
      expect(mkPattern(3, 10).arraySync()).toEqual([
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        -1,
        -1
      ]);
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

      expect(fftPhase(start)).toEqual(phase1.arraySync());
      expect(fftPhase(phase1)).toEqual(phase2.arraySync());
      expect(fftPhase(phase2)).toEqual(phase3.arraySync());
      expect(fftPhase(phase3)).toEqual(phase4.arraySync());
    });
  });

  describe("fftRepeatPhase()", () => {
    const example1 = numbersFromInput("80871224585914546619083218645595");
    const example2 = numbersFromInput("19617804207202209144916044189917");
    const example3 = numbersFromInput("69317163492948606335995924319873");

    it("should yield the correct output for example1", () => {
      const expected = numbersFromInput("24176176").arraySync();
      const actual = fftRepeatPhase(example1, 100)
        .slice(0, 8)
        .arraySync();

      expect(actual).toEqual(expected);
    });

    it("should yield the correct output for example2", () => {
      const expected = numbersFromInput("73745418").arraySync();
      const actual = fftRepeatPhase(example2, 100)
        .slice(0, 8)
        .arraySync();

      expect(actual).toEqual(expected);
    });

    it("should yield the correct output for example3", () => {
      const expected = numbersFromInput("52432133").arraySync();
      const actual = fftRepeatPhase(example3, 100)
        .slice(0, 8)
        .arraySync();

      expect(actual).toEqual(expected);
    });
  });

  describe("task1()", () => {
    it("should compute the correct value", () => {
      expect(task1()).toBe("52611030");
    });
  });

  describe("fftRealComputation()", () => {
    const example1 = "80871224585914546619083218645595";
    const example2 = "19617804207202209144916044189917";
    const example3 = "69317163492948606335995924319873";

    it("should compute the expected output for example1", () => {
      // expect(fftRealComputation(example1)).toBe("84462026");
    });

    it("should compute the expected output for example2", () => {
      // expect(fftRealComputation(example2)).toBe("78725270");
    });

    it("should compute the expected output for example3", () => {
      // expect(fftRealComputation(example3)).toBe("53553731");
    });
  });
});
