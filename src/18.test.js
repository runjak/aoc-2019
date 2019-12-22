import { findEntrance, step, stepsToSolve } from "./18";

describe("18", () => {
  const example1 = ["#########", "#b.A.@.a#", "#########"];
  const example2 = [
    "########################",
    "#f.D.E.e.C.b.A.@.a.B.c.#",
    "######################.#",
    "#d.....................#",
    "########################"
  ];
  const example3 = [
    "########################",
    "#...............b.C.D.f#",
    "#.######################",
    "#.....@.a.B.c.d.A.e.F.g#",
    "########################"
  ];
  const example4 = [
    "#################",
    "#i.G..c...e..H.p#",
    "########.########",
    "#j.A..b...f..D.o#",
    "########@########",
    "#k.E..a...g..B.n#",
    "########.########",
    "#l.F..d...h..C.m#",
    "#################"
  ];
  const example5 = [
    "########################",
    "#@..............ac.GI.b#",
    "###d#e#f################",
    "###A#B#C################",
    "###g#h#i################",
    "########################"
  ];

  describe("findEntrance()", () => {
    it("should find the entrance in example1", () => {
      expect(findEntrance(example1)).toEqual([5, 1]);
    });

    it("should find the entrance in example2", () => {
      expect(findEntrance(example2)).toEqual([15, 1]);
    });
    it("should find the entrance in example3", () => {
      expect(findEntrance(example3)).toEqual([6, 3]);
    });
    it("should find the entrance in example4", () => {
      expect(findEntrance(example4)).toEqual([8, 4]);
    });
    it("should find the entrance in example5", () => {
      expect(findEntrance(example5)).toEqual([1, 1]);
    });
  });

  describe("step()", () => {
    it("should create the expected next states for example1", () => {
      const expected = [
        [["#########", "#b.A.@:a#", "#########"], 6, 1],
        [["#########", "#b.A:@.a#", "#########"], 4, 1]
      ];
      const actual = step(example1, 5, 1);

      expect(actual).toEqual(expected);
    });

    it("should open doors and unvisit places when finding a key", () => {
      const expected = [[["#########", "#b.....:#", "#########"], 7, 1]];
      const actual = step(["#########", "#b.A.::a#", "#########"], 6, 1);

      expect(actual).toEqual(expected);
    });
  });

  describe("stepsToSolve()", () => {
    it("should compute the specified number for example1", () => {
      expect(stepsToSolve(example1)).toBe(8);
    });

    // it("should compute the specified number for example2", () => {
    //   expect(stepsToSolve(example2)).toBe(86);
    // });

    // it("should compute the specified number for example3", () => {
    //   expect(stepsToSolve(example3)).toBe(132);
    // });

    // it("should compute the specified number for example4", () => {
    //   expect(stepsToSolve(example4)).toBe(136);
    // });

    // it("should compute the specified number for example5", () => {
    //   expect(stepsToSolve(example5)).toBe(81);
    // });
  });
});
