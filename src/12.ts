import { vec3 } from "gl-matrix";
import sum from "lodash/sum";

import input from "./12.input.json";

type Moon = {
  position: vec3;
  velocity: vec3;
};

// Assuming sane input
export const mkMoons = (input: Array<any>): Array<Moon> =>
  input.map(({ x, y, z }) => ({
    position: vec3.fromValues(x, y, z),
    velocity: vec3.fromValues(0, 0, 0)
  }));

export const velocityDeltas = (m1: Moon, m2: Moon): [vec3, vec3] => {
  const [x, y, z] = vec3.subtract(vec3.create(), m2.position, m1.position);

  const delta1 = vec3.fromValues(Math.sign(x), Math.sign(y), Math.sign(z));
  const delta2 = vec3.negate(vec3.create(), delta1);

  return [delta1, delta2];
};

export const cloneMoon = ({ position, velocity }: Moon): Moon => ({
  position: vec3.clone(position),
  velocity: vec3.clone(velocity)
});

export const applyGravity = (moons: Array<Moon>): Array<Moon> => {
  const newMoons = moons.map(cloneMoon);

  for (let i = 0; i < moons.length; i++) {
    const m1 = newMoons[i];
    for (let j = i + 1; j < moons.length; j++) {
      const m2 = newMoons[j];
      const [v1, v2] = velocityDeltas(m1, m2);

      vec3.add(m1.velocity, m1.velocity, v1);
      vec3.add(m2.velocity, m2.velocity, v2);
    }
  }

  return newMoons;
};

export const applyVelocity = (moons: Array<Moon>): Array<Moon> =>
  moons.map(
    ({ position, velocity }: Moon): Moon => ({
      position: vec3.add(vec3.create(), position, velocity),
      velocity
    })
  );

export function* simulateMoons(
  moons: Array<Moon>
): Generator<Array<Moon>, void, unknown> {
  let currentMoons = moons;

  while (true) {
    yield currentMoons;

    currentMoons = applyVelocity(applyGravity(currentMoons));
  }
}

export const potentialMoonEnergy = ({ position }: Moon): number =>
  sum(position.map(n => Math.abs(n)));

export const kineticMoonEnergy = ({ velocity }: Moon): number =>
  sum(velocity.map(n => Math.abs(n)));

export const totalMoonEnergy = (moon: Moon): number =>
  potentialMoonEnergy(moon) * kineticMoonEnergy(moon);

export const totalEnergy = (moons: Array<Moon>): number =>
  sum(moons.map(totalMoonEnergy));

export const simulateMoonSteps = (
  steps: number,
  moons: Array<Moon>
): Array<Moon> => {
  let i = 0;
  for (const currentMoons of simulateMoons(moons)) {
    i++;
    if (i > steps) {
      return currentMoons;
    }
  }

  return [];
};

export const task1 = (): number =>
  totalEnergy(simulateMoonSteps(1000, mkMoons(input)));
