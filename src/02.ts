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

export function setup(program: IntProgram): IntProgram {
  const copy = [...program];
  copy[1] = 12;
  copy[2] = 2;

  return copy;
}

function solution() {
  console.log(`02-1: ${execute(setup(input), 0)[0]}`);
}

solution();
