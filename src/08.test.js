import { sliceImage, scoreLayer } from "./08";

describe("08", () => {
  describe("sliceImage()", () => {
    it("should slice as expected", () => {
      const expected = ["123456", "789012"];
      const actual = sliceImage("123456789012", 3, 2);

      expect(actual).toEqual(expected);
    });
  });

  describe("scoreLayer()", () => {
    it("should compute a correct score", () => {
      const input = "0-120129012";
      const expected = {
        zeroCount: 3,
        oneCount: 3,
        twoCount: 3
      };

      expect(scoreLayer(input)).toEqual(expected);
    });
  });
});
