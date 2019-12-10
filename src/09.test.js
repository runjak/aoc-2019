import { parseOp } from "./05";
import { mkState, execute, task1 } from "./09";

describe("09", () => {
  describe("parseOp()", () => {
    it("should parse parameter modes as expected", () => {
      const instructions = [1, 101, 1001, 10001, 1201, 12001, 20101];

      const expected = [
        { code: 1, parameterModes: [0, 0, 0] },
        { code: 1, parameterModes: [1, 0, 0] },
        { code: 1, parameterModes: [0, 1, 0] },
        { code: 1, parameterModes: [0, 0, 1] },
        { code: 1, parameterModes: [2, 1, 0] },
        { code: 1, parameterModes: [0, 2, 1] },
        { code: 1, parameterModes: [1, 0, 2] }
      ];
      const actual = instructions.map(parseOp);

      expect(actual).toEqual(expected);
    });
  });

  describe("execute()", () => {
    const fail = () => {
      throw new Error("failed!");
    };

    it("should adjust the relative base as expected", async () => {
      const code = [109, 5, 99];

      const expected = {
        memory: [...code],
        pc: 3,
        relativeBase: 5
      };
      const actual = await execute(mkState(code), fail, fail);

      expect(actual).toEqual(expected);
    });

    it("should correctly execute example1", async () => {
      const example = JSON.parse(
        // 109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99
        "[109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99]"
      );
      const expected = [...example];
      const actual = [];

      await execute(mkState(example), fail, async n => actual.push(n));

      expect(actual).toEqual(expected);
    });

    it("should correctly execute example2", async () => {
      const example = JSON.parse("[1102,34915192,34915192,7,4,7,99,0]");
      const expected = [example[1] * example[2]];
      const actual = [];

      await execute(mkState(example), fail, n => actual.push(n));

      expect(actual).toEqual(expected);
    });

    it("should correctly execute example3", async () => {
      const example = JSON.parse("[104,1125899906842624,99]");
      const expected = [example[1]];
      const actual = [];

      await execute(mkState(example), fail, n => actual.push(n));

      expect(actual).toEqual(expected);
    });
  });

  describe("task1()", () => {
    it("should produce the expected boost code", async () => {
      const expected = [3546494377];
      const actual = await task1();

      expect(actual).toEqual(expected);
    });
  });
});
