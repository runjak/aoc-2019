import sum from "lodash/sum";

import moduleMasses from "./01.input.json";

/*
Fuel required to launch a given module is based on its mass.
Specifically, to find the fuel required for a module, take its mass, divide by three, round down, and subtract 2.

For example:

- For a mass of 12, divide by 3 and round down to get 4, then subtract 2 to get 2.
- For a mass of 14, dividing by 3 and rounding down still yields 4, so the fuel required is also 2.
- For a mass of 1969, the fuel required is 654.
- For a mass of 100756, the fuel required is 33583.

*/
export function fuelForModule(mass: number): number {
  return Math.floor(mass / 3) - 2;
}

// sum of all fuel requirements
export function task1(): number {
  return sum(moduleMasses.map(fuelForModule));
}

export function recursiveFuelForModule(mass: number): number {
  let fuel = fuelForModule(mass);
  let totalFuel = 0;

  while (fuel > 0) {
    totalFuel += fuel;
    fuel = fuelForModule(fuel);
  }

  return totalFuel;
}

export function task2(): number {
  return sum(moduleMasses.map(recursiveFuelForModule));
}

function solution() {
  console.log(`01-1: ${task1()}`);
  console.log(`01-2: ${task2()}`);
}
