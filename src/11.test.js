import { paint, task1 } from "./11";

describe("11", () => {
  describe("paint()", () => {
    it("should paint a panel white, turn left and move", async () => {
      const expected = {
        direction: "<",
        position: [-1, 0],
        panel: {
          "0,0": 1
        }
      };

      const program = [1104, 1, 1104, 0, 99];
      const robot = await paint(program);

      expect(robot).toEqual(expected);
    });
  });

  describe("task1()", () => {
    it("should not compute 1", async () => {
      const actual = await task1();

      expect(actual).not.toBe(1);
    });

    it("should compute the expected value", async () => {
      const expected = 1686;
      const actual = await task1();

      expect(actual).toBe(expected);
    });
  });
});
