import { fuelForModule, task1, recursiveFuelForModule, task2 } from "./01";

describe("01", () => {
  describe("fuelForModule()", () => {
    const fuelRequirements = [
      { mass: 12, expected: 2 },
      { mass: 14, expected: 2 },
      { mass: 1969, expected: 654 },
      { mass: 100756, expected: 33583 }
    ];

    it("should behave as described in the task", () => {
      fuelRequirements.forEach(({ mass, expected }) => {
        const actual = fuelForModule(mass);

        expect(actual).toBe(expected);
      });
    });
  });

  describe("task1()", () => {
    it("should return the validated answer", () => {
      const validated = 3282935;

      expect(task1()).toBe(validated);
    });
  });

  describe("recursiveFuelForModule()", () => {
    const recursiveFuelRequirements = [
      { mass: 14, expected: 2 },
      { mass: 1969, expected: 966 },
      { mass: 100756, expected: 50346 }
    ];

    it("should behave as described in the task", () => {
      recursiveFuelRequirements.forEach(({ mass, expected }) => {
        const actual = recursiveFuelForModule(mass);

        expect(actual).toBe(expected);
      });
    });
  });

  describe("task2()", () => {
    it("should return the validated answer", () => {
      const validated = 4921542;

      expect(task2()).toBe(validated);
    });
  });
});
