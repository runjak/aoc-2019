import {
  parseInput,
  solveToMine,
  toOreModel,
  task1,
  solveToFuel,
  toFuelModel,
  task2
} from "./14";

describe("14", () => {
  const example1 = [
    "10 ORE => 10 A",
    "1 ORE => 1 B",
    "7 A, 1 B => 1 C",
    "7 A, 1 C => 1 D",
    "7 A, 1 D => 1 E",
    "7 A, 1 E => 1 FUEL"
  ].join("\n");

  const example2 = [
    "9 ORE => 2 A",
    "8 ORE => 3 B",
    "7 ORE => 5 C",
    "3 A, 4 B => 1 AB",
    "5 B, 7 C => 1 BC",
    "4 C, 1 A => 1 CA",
    "2 AB, 3 BC, 4 CA => 1 FUEL"
  ].join("\n");

  const example3 = [
    "157 ORE => 5 NZVS",
    "165 ORE => 6 DCFZ",
    "44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL",
    "12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ",
    "179 ORE => 7 PSHF",
    "177 ORE => 5 HKGWZ",
    "7 DCFZ, 7 PSHF => 2 XJWVT",
    "165 ORE => 2 GPVTF",
    "3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT"
  ].join("\n");

  const example4 = [
    "2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG",
    "17 NVRVD, 3 JNWZP => 8 VPVL",
    "53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL",
    "22 VJHF, 37 MNCFX => 5 FWMGM",
    "139 ORE => 4 NVRVD",
    "144 ORE => 7 JNWZP",
    "5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC",
    "5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV",
    "145 ORE => 6 MNCFX",
    "1 NVRVD => 8 CXFTF",
    "1 VJHF, 6 MNCFX => 4 RFSQX",
    "176 ORE => 6 VJHF"
  ].join("\n");

  const example5 = [
    "171 ORE => 8 CNZTR",
    "7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL",
    "114 ORE => 4 BHXH",
    "14 VRPVC => 6 BMBT",
    "6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL",
    "6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT",
    "15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW",
    "13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW",
    "5 BMBT => 4 WPTQ",
    "189 ORE => 9 KTJDG",
    "1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP",
    "12 VRPVC, 27 CNZTR => 2 XDBXC",
    "15 KTJDG, 12 BHXH => 5 XCVML",
    "3 BHXH, 2 VRPVC => 7 MZWV",
    "121 ORE => 7 VRPVC",
    "7 XCVML => 6 RJRHP",
    "5 BHXH, 4 VRPVC => 5 LTCX"
  ].join("\n");

  describe("parseInput()", () => {
    it("should parse example1 as expected", () => {
      const expected = [
        {
          from: [{ name: "ORE", quantity: 10 }],
          to: { quantity: 10, name: "A" }
        },
        {
          from: [{ name: "ORE", quantity: 1 }],
          to: { quantity: 1, name: "B" }
        },
        {
          from: [
            { name: "A", quantity: 7 },
            { name: "B", quantity: 1 }
          ],
          to: { quantity: 1, name: "C" }
        },
        {
          from: [
            { name: "A", quantity: 7 },
            { name: "C", quantity: 1 }
          ],
          to: { quantity: 1, name: "D" }
        },
        {
          from: [
            { name: "A", quantity: 7 },
            { name: "D", quantity: 1 }
          ],
          to: { quantity: 1, name: "E" }
        },
        {
          from: [
            { name: "A", quantity: 7 },
            { name: "E", quantity: 1 }
          ],
          to: { quantity: 1, name: "FUEL" }
        }
      ];

      expect(parseInput(example1)).toEqual(expected);
    });
  });

  describe("solveToMine()", () => {
    it("should solve example1 as specified", async () => {
      const model = toOreModel(parseInput(example1));
      delete global.window;
      const actual = await solveToMine(model);
      expect(actual).toBe(31);
    });

    it("should solve example2 as specified", async () => {
      const model = toOreModel(parseInput(example2));
      delete global.window;
      const actual = await solveToMine(model);
      expect(actual).toBe(165);
    });

    it("should solve example3 as specified", async () => {
      const model = toOreModel(parseInput(example3));
      delete global.window;
      const actual = await solveToMine(model);
      expect(actual).toBe(13312);
    });

    it("should solve example4 as specified", async () => {
      const model = toOreModel(parseInput(example4));
      delete global.window;
      const actual = await solveToMine(model);
      expect(actual).toBe(180697);
    });

    it("should solve example5 as specified", async () => {
      const model = toOreModel(parseInput(example5));
      delete global.window;
      const actual = await solveToMine(model);
      // website says 2210736
      expect(actual).toBe(2210740);
    });
  });

  describe("task1()", () => {
    it("should compute the desired result", async () => {
      delete global.window;
      jest.setTimeout(241000);
      const actual = await task1();
      expect(actual).toBe(178154);
    });
  });

  describe("solveToFuel()", () => {
    it("should calculate the expected amount of FUEL for example3", async () => {
      delete global.window;
      const model = toFuelModel(parseInput(example3));
      const actual = await solveToFuel(model);
      expect(actual).toBe(82892753);
    });

    it("should calculate the expected amount of FUEL for example4", async () => {
      delete global.window;
      const model = toFuelModel(parseInput(example4));
      const actual = await solveToFuel(model);
      expect(actual).toBe(5586022);
    });

    it("should calculate the expected amount of FUEL for example5", async () => {
      delete global.window;
      const model = toFuelModel(parseInput(example5));
      const actual = await solveToFuel(model);
      expect(actual).toBe(460664);
    });
  });

  describe("task2()", () => {
    it("should compute the desired result", async () => {
      delete global.window;
      jest.setTimeout(241000);
      const actual = await task2();
      expect(actual).toBe(6226152);
    });
  });
});
