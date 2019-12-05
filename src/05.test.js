import { isOpCode, OpCode, ParameterMode, parseOp, execute } from "./05";

describe("05", () => {
  describe("isOpCode()", () => {
    it("should recognize the code for halt", () => {
      expect(isOpCode(OpCode.Halt)).toBeTruthy();
    });
  });

  describe("parseOp()", () => {
    it("should parse a read op as expected", () => {
      const expected = {
        code: OpCode.Read,
        parameterModes: [ParameterMode.Position]
      };
      const actual = parseOp(3);

      expect(actual).toEqual(expected);
    });

    it("should parse multiplication with mode flags as expected", () => {
      const expected = {
        code: OpCode.Multiply,
        parameterModes: [
          ParameterMode.Position,
          ParameterMode.Immediate,
          ParameterMode.Position
        ]
      };
      const actual = parseOp(1002);

      expect(actual).toEqual(expected);
    });

    it("should parse addition with mode flags as expected", () => {
      const expected = {
        code: OpCode.Add,
        parameterModes: [
          ParameterMode.Immediate,
          ParameterMode.Immediate,
          ParameterMode.Position
        ]
      };
      const actual = parseOp(1101);

      expect(actual).toEqual(expected);
    });
  });

  describe("execute()", () => {
    const example1 = [3, 0, 4, 0, 99];
    const example2 = [1002, 4, 3, 4, 33];
    const example3 = [1101, 100, -1, 4, 0];
    const example4 = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8];
    const example5 = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8];
    const example6 = [3, 3, 1108, -1, 8, 3, 4, 3, 99];
    const example7 = [3, 3, 1107, -1, 8, 3, 4, 3, 99];
    const example8 = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9];
    const example9 = [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1];
    const example10 = [
      3,
      21,
      1008,
      21,
      8,
      20,
      1005,
      20,
      22,
      107,
      8,
      21,
      20,
      1006,
      20,
      31,
      1106,
      0,
      36,
      98,
      0,
      0,
      1002,
      21,
      125,
      20,
      4,
      20,
      1105,
      1,
      46,
      104,
      999,
      1105,
      1,
      46,
      1101,
      1000,
      1,
      20,
      4,
      20,
      1105,
      1,
      46,
      98,
      99
    ];

    it("should execute example1 as specified", () => {
      const program = [...example1];
      const stdIn = [23];
      const stdOut = [];

      execute(program, stdIn, stdOut);

      expect(stdOut).toEqual([23]);
    });

    it("should execute example2 as specified", () => {
      const program = [...example2];
      const expected = [1002, 4, 3, 4, 99];

      execute(program, [], []);
      expect(program).toEqual(expected);
    });

    it("should execute example3 as specified", () => {
      const program = [...example3];
      const expected = [1101, 100, -1, 4, 99];

      execute(program, [], []);
      expect(program).toEqual(expected);
    });

    it("should output 1 for input 8 with example4", () => {
      const program = [...example4];
      const stdIn = [8];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([1]);
    });

    it("should output 0 for input ¬8 with example4", () => {
      const program = [...example4];
      const stdIn = [5];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([0]);
    });

    it("should output 1 for input <8 with example5", () => {
      const program = [...example5];
      const stdIn = [5];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([1]);
    });

    it("should output 0 for input 8 with example5", () => {
      const program = [...example5];
      const stdIn = [8];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([0]);
    });

    it("should output 0 for input >8 with example5", () => {
      const program = [...example5];
      const stdIn = [11];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([0]);
    });

    it("should output 1 for input 8 with example6", () => {
      const program = [...example6];
      const stdIn = [8];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([1]);
    });

    it("should output 0 for input ¬8 with example6", () => {
      const program = [...example6];
      const stdIn = [11];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([0]);
    });

    it("should output 1 for input <8 with example7", () => {
      const program = [...example7];
      const stdIn = [5];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([1]);
    });

    it("should output 0 for input 8 with example7", () => {
      const program = [...example7];
      const stdIn = [8];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([0]);
    });

    it("should output 0 for input >8 with example7", () => {
      const program = [...example7];
      const stdIn = [11];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([0]);
    });

    it("should output 0 for input 0 with example8", () => {
      const program = [...example8];
      const stdIn = [0];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([0]);
    });

    it("should output 1 for input ¬0 with example8", () => {
      const program = [...example8];
      const stdIn = [11];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([1]);
    });

    it("should output 0 for input 0 with example9", () => {
      const program = [...example9];
      const stdIn = [0];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([0]);
    });

    it("should output 1 for input ¬0 with example9", () => {
      const program = [...example9];
      const stdIn = [11];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([1]);
    });

    it("should output 999 for input <8 with example10", () => {
      const program = [...example10];
      const stdIn = [7];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([999]);
    });

    it("should output 1000 for input 8 with example10", () => {
      const program = [...example10];
      const stdIn = [8];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([1000]);
    });

    it("should output 1001 for input >8 with example10", () => {
      const program = [...example10];
      const stdIn = [11];
      const stdOut = [];

      execute(program, stdIn, stdOut);
      expect(stdOut).toEqual([1001]);
    });
  });
});
