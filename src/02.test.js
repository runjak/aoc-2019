import input from "./02.input.json";
import { add, multiply, execute, setup } from "./02";

describe("02", () => {
  describe("add()", () => {
    it("should correctly add values", () => {
      const program = [0, 3, 1, 0];
      const expected = [3, 3, 1, 0];

      const actual = add(program, 0);

      expect(actual).toEqual(expected);
    });

    it("should handle collisions", () => {
      const program = [0, 100, 100, 100];
      program[100] = 5;

      const expected = [...program];
      expected[100] = 10;

      const actual = add(program, 0);

      expect(actual).toEqual(expected);
    });
  });

  describe("multiply()", () => {
    it("should correctly multiply values", () => {
      const program = [0, 1, 2, 0];
      const expected = [2, 1, 2, 0];

      const actual = multiply(program, 0);

      expect(actual).toEqual(expected);
    });

    it("should handle collisions", () => {
      const program = [0, 100, 100, 100];
      program[100] = 5;

      const expected = [...program];
      expected[100] = 25;

      const actual = multiply(program, 0);

      expect(actual).toEqual(expected);
    });
  });

  describe("execute()", () => {
    it("should execute the example program as expected", () => {
      const exampleProgram = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50];
      const expected = [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50];

      const actual = execute(exampleProgram, 0);

      expect(actual).toEqual(expected);
    });

    it("should correctly execute small example 1", () => {
      const program = [1, 0, 0, 0, 99];
      const expected = [2, 0, 0, 0, 99];

      const actual = execute(program, 0);

      expect(actual).toEqual(expected);
    });

    it("should correctly execute small example 2", () => {
      const program = [2, 3, 0, 3, 99];
      const expected = [2, 3, 0, 6, 99];

      const actual = execute(program, 0);

      expect(actual).toEqual(expected);
    });

    it("should correctly execute small example 3", () => {
      const program = [2, 4, 4, 5, 99, 0];
      const expected = [2, 4, 4, 5, 99, 9801];

      const actual = execute(program, 0);

      expect(actual).toEqual(expected);
    });

    it("should correctly execute small example 4", () => {
      const program = [1, 1, 1, 4, 99, 5, 6, 0, 99];
      const expected = [30, 1, 1, 4, 2, 5, 6, 0, 99];

      const actual = execute(program, 0);

      expect(actual).toEqual(expected);
    });

    it("should not provide the first wrong solution", () => {
      const wrong = 406198;
      const result = execute(setup(input), 0)[0];

      expect(result).not.toBe(wrong);
    });
  });
});
