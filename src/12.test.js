import { vec3 } from "gl-matrix";
import simulatedMoons from "./12.test.simulateMoons.json";
import {
  mkMoons,
  velocityDeltas,
  simulateMoons,
  totalEnergy,
  simulateMoonSteps,
  task1
} from "./12";

describe("12", () => {
  const example1 = [
    { x: -1, y: 0, z: 2 },
    { x: 2, y: -10, z: -7 },
    { x: 4, y: -8, z: 8 },
    { x: 3, y: 5, z: -1 }
  ];
  const example2 = [
    { x: -8, y: -10, z: 0 },
    { x: 5, y: 5, z: 10 },
    { x: 2, y: -7, z: 3 },
    { x: 9, y: -8, z: -3 }
  ];

  describe("mkMoons()", () => {
    it("should correctly create example moons", () => {
      const expected = [
        {
          position: vec3.fromValues(-1, 0, 2),
          velocity: vec3.fromValues(0, 0, 0)
        },
        {
          position: vec3.fromValues(2, -10, -7),
          velocity: vec3.fromValues(0, 0, 0)
        },
        {
          position: vec3.fromValues(4, -8, 8),
          velocity: vec3.fromValues(0, 0, 0)
        },
        {
          position: vec3.fromValues(3, 5, -1),
          velocity: vec3.fromValues(0, 0, 0)
        }
      ];

      expect(mkMoons(example1)).toEqual(expected);
    });
  });

  describe("velocityDeltas()", () => {
    it("should compute the expected deltas for two moons", () => {
      const moon1 = { position: vec3.fromValues(5, -5, 0) };
      const moon2 = { position: vec3.fromValues(3, 3, 0) };

      const expected = [vec3.fromValues(-1, 1, 0), vec3.fromValues(1, -1, -0)];

      expect(velocityDeltas(moon1, moon2)).toEqual(expected);
    });
  });

  describe("simulateMoons()", () => {
    it("should calculate moons as specified for the first 10 steps of example1", () => {
      const expected = simulatedMoons.map(moons =>
        moons.map(({ position, velocity }) => ({
          position: vec3.fromValues(position.x, position.y, position.z),
          velocity: vec3.fromValues(velocity.x, velocity.y, velocity.z)
        }))
      );

      let actual = [];
      const moonGen = simulateMoons(mkMoons(example1));
      let i = 0;
      for (const moons of moonGen) {
        actual.push(moons);
        i++;
        if (i > 10) {
          break;
        }
      }

      expect(actual).toEqual(expected);
    });
  });

  describe("totalEnergy()", () => {
    it("should compute the total energy for example1 after 10 steps", () => {
      const moons = simulateMoonSteps(10, mkMoons(example1));
      const expected = 179;

      expect(totalEnergy(moons)).toBe(expected);
    });

    it("should compute the total energy for example2 after 100 steps", () => {
      const moons = simulateMoonSteps(100, mkMoons(example2));
      const expected = 1940;

      expect(totalEnergy(moons)).toBe(expected);
    });
  });

  describe("task1()", () => {
    it("should compute the correct number", () => {
      expect(task1()).toBe(9999);
    });
  });
});
