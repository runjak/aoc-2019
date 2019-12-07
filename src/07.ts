import flatten from "lodash/flatten";
import permutated from "permutated";

import { execute, Memory } from "./05";
import amplifierProgram from "./07.input.json";

export const computeAmplifier = (
  code: Memory,
  phase: number,
  input: number
): number => {
  const program = [...code];
  const stdIn = [phase, input];
  const stdOut: Array<number> = [];

  execute(program, stdIn, stdOut);

  return stdOut[0] || NaN;
};

export const computeAmplifiers = (
  code: Memory,
  phases: Array<number>,
  input: number
): number =>
  phases.reduce(
    (prevOutput: number, phase: number): number =>
      computeAmplifier(code, phase, prevOutput),
    input
  );

// Phase settings are basically numbers to base 5
export const phaseSettings = (toUse: string): Array<Array<number>> => {
  return flatten([permutated(toUse)]).map(word =>
    word.split("").map(d => Number(d))
  );
};

export const findMaxOutput = (code: Memory): number => {
  return Math.max(
    ...phaseSettings("01234")
      .map((settings: Array<number>): number =>
        computeAmplifiers(code, settings, 0)
      )
      .filter(n => !Number.isNaN(n))
  );
};

const task1 = () => findMaxOutput(amplifierProgram);

export const solution = () => {
  console.log(`07-1: ${task1()}`);
};
