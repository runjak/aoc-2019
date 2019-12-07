import flatten from "lodash/flatten";
import permutated from "permutated";

import {
  execute,
  Memory,
  OpCode,
  parseOp,
  add,
  multiply,
  read,
  write,
  jumpIfTrue,
  jumpIfFalse,
  lessThan,
  equals,
  opLength
} from "./05";
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

export const asyncExecute = async (
  program: Memory,
  stdIn: () => Promise<number>,
  stdOut: (out: number) => Promise<void>
) => {
  let pc = 0;
  let jumped = false;

  while (true) {
    jumped = false;
    const { code, parameterModes } = parseOp(program[pc]);

    switch (code) {
      case OpCode.Add:
        add(program, pc, parameterModes);
        break;

      case OpCode.Multiply:
        multiply(program, pc, parameterModes);
        break;

      case OpCode.Read:
        const input = await stdIn();
        read(program, [input], pc);
        break;

      case OpCode.Write:
        const output: Array<number> = [];
        write(program, output, pc, parameterModes);
        await stdOut(output[0] || NaN);
        break;

      case OpCode.JumpIfTrue:
        const jit = jumpIfTrue(program, pc, parameterModes);

        if (jit !== null) {
          pc = jit;
          jumped = true;
        }

        break;

      case OpCode.JumpIfFalse:
        const jif = jumpIfFalse(program, pc, parameterModes);

        if (jif !== null) {
          pc = jif;
          jumped = true;
        }

        break;

      case OpCode.LessThan:
        lessThan(program, pc, parameterModes);
        break;

      case OpCode.Equals:
        equals(program, pc, parameterModes);
        break;

      case OpCode.Halt:
      default:
        return;
    }

    if (!jumped) {
      pc += opLength(code);
    }
  }
};

type Buffer = {
  write: (input: number) => Promise<void>;
  read: () => Promise<number>;
};

export const mkBuffer = (): Buffer => {
  const buffer: Array<number> = [];
  let cbs: Array<() => void> = [];

  return {
    write: async (input: number) => {
      buffer.push(input);

      const cb = cbs.shift();
      if (cb) {
        cb();
      }
    },
    read: (): Promise<number> => {
      return new Promise(resolve => {
        if (buffer.length > 0) {
          resolve(buffer.shift());
        } else {
          cbs.push(() => resolve(buffer.shift()));
        }
      });
    }
  };
};

export const asyncComputeAmplifier = async (
  code: Memory,
  buffer: Buffer
): Promise<void> => {
  const program = [...code];

  return asyncExecute(program, buffer.read, buffer.write);
};

export const asyncComputeAmplifiers = async (
  code: Memory,
  [p1, p2, p3, p4, p5]: Array<number>,
  initialInput: number
): Promise<number> => {
  const b1 = mkBuffer();
  const b2 = mkBuffer();
  const b3 = mkBuffer();
  const b4 = mkBuffer();
  const b5 = mkBuffer();

  await b1.write(p1);
  await b2.write(p2);
  await b3.write(p3);
  await b4.write(p4);
  await b5.write(p5);

  let lastA5 = NaN;

  const a1 = asyncComputeAmplifier(code, { read: b1.read, write: b2.write });
  const a2 = asyncComputeAmplifier(code, { read: b2.read, write: b3.write });
  const a3 = asyncComputeAmplifier(code, { read: b3.read, write: b4.write });
  const a4 = asyncComputeAmplifier(code, { read: b4.read, write: b5.write });
  const a5 = asyncComputeAmplifier(code, {
    read: b5.read,
    write: (x: number) => {
      lastA5 = x;

      return b1.write(x);
    }
  });

  await b1.write(initialInput);
  await a5;

  return lastA5;
};

export const asyncFindMaxOutput = async (code: Memory): Promise<number> => {
  const vals = await Promise.all(
    phaseSettings("56789").map(settings =>
      asyncComputeAmplifiers(code, settings, 0)
    )
  );

  return Math.max(...vals.filter(n => !Number.isNaN(n)));
};

export const task2 = async () => asyncFindMaxOutput(amplifierProgram);

export const solution = async () => {
  console.log(`07-1: ${task1()}`);
};
