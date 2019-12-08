import { sliceImage, scoreLayer, mergeLayers } from "./08";

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

  describe("mergeLayers()", () => {
    it("should merge layers as specified in the example", () => {
      const example = "0222112222120000";
      const layers = sliceImage(example, 2, 2);

      const expected = "0110";
      const actual = mergeLayers(layers);

      expect(actual).toEqual(expected);
    });
  });
});
