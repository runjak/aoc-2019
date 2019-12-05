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
    it("should execute example 1 as specified", () => {
      const program = [3, 0, 4, 0, 99];
      const stdIn = [23];
      const stdOut = [];

      execute(program, stdIn, stdOut);

      expect(stdOut).toEqual([23]);
    });

    it("should execute example 2 as specified", () => {
      const program = [1002, 4, 3, 4, 33];
      const expected = [1002, 4, 3, 4, 99];

      execute(program, [], []);
      expect(program).toEqual(expected);
    });

    it("should execute example 3 as specified", () => {
      const program = [1101, 100, -1, 4, 0];
      const expected = [1101, 100, -1, 4, 99];

      execute(program, [], []);
      expect(program).toEqual(expected);
    });
  });
});
