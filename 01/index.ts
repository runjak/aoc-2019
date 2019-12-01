import sum from "lodash/sum";

import moduleMasses from "./input.json";

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

export function test_fuelForModule() {
  console.log("test_fuelForModule()");

  [
    { mass: 12, expected: 2 },
    { mass: 14, expected: 2 },
    { mass: 1969, expected: 654 },
    { mass: 100756, expected: 33583 }
  ].forEach(({ mass, expected }) => {
    const actual = fuelForModule(mass);
    const same = String(expected === actual);

    console.log(`${mass} -> ${expected} === ${actual}: ${same}`);
  });
}

// sum of all fuel requirements
export function task1(): number {
  return sum(moduleMasses.map(fuelForModule));
}

export function test_task1() {
  const expected = 3282935;
  const actual = task1();

  console.log(`task1() is ${expected}: ${String(actual === expected)}`);
}

function solution() {
  console.log(`01-1: ${task1()}`);
}

solution();
