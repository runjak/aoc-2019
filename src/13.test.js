import { task1 } from "./13";

describe("13", () => {
  describe("task1()", () => {
    it("should count the number of block tiles on exit", async () => {
      const actual = await task1();

      expect(actual).toBe(296);
    });
  });
});
