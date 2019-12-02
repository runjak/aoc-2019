import input from "./02.input.json";

enum OpCode {
  Add = 1,
  Multiply = 2,
  Halt = 99
}

const commandSize = 4;

type IntProgram = Array<number>;
type ProgramPointer = number;

export function add(program: IntProgram, pc: ProgramPointer): IntProgram {
  const p1 = program[pc + 1];
  const p2 = program[pc + 2];
  const p3 = program[pc + 3];

  const copy = [...program];
  copy[p3] = copy[p1] + copy[p2];

  return copy;
}

export function multiply(program: IntProgram, pc: ProgramPointer): IntProgram {
  const p1 = program[pc + 1];
  const p2 = program[pc + 2];
  const p3 = program[pc + 3];

  const copy = [...program];
  copy[p3] = copy[p1] * copy[p2];

  return copy;
}

export function execute(program: IntProgram, pc: ProgramPointer): IntProgram {
  const opCode = program[pc];

  switch (opCode) {
    case OpCode.Add:
      return execute(add(program, pc), pc + commandSize);

    case OpCode.Multiply:
      return execute(multiply(program, pc), pc + commandSize);

    case OpCode.Halt:
      return program;

    default:
      throw new Error(`Unexpected OpCode: ${opCode}`);
  }
}

export function setup(
  program: IntProgram,
  noun: number = 12,
  verb: number = 2
): IntProgram {
  const copy = [...program];
  copy[1] = noun;
  copy[2] = verb;

  return copy;
}

type SetupParameters = { noun: number; verb: number };

export function setupSignature({ noun, verb }: SetupParameters): number {
  return 100 * noun + verb;
}

const desired = 19690720;

export function seekSetupParameters(
  program: IntProgram,
  desired: number
): SetupParameters | null {
  for (let noun = 1; noun < 99; noun++) {
    for (let verb = 1; verb < 99; verb++) {
      const result = execute(setup(program, noun, verb), 0)[0];

      if (result === desired) {
        return { noun, verb };
      }
    }
  }

  return null;
}

function solution() {
  console.log(`02-1: ${execute(setup(input), 0)[0]}`);

  const setupParameters = seekSetupParameters(input, desired);
  if (setupParameters) {
    console.log(`02-2: ${setupSignature(setupParameters)}`);
  } else {
    console.log("02-2: no solution found");
  }
}
