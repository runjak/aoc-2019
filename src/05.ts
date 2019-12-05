import range from "lodash/range";
import input from "./05.input.json";

type Memory = Array<number>;

export enum OpCode {
  Add = 1,
  Multiply = 2,
  Read = 3,
  Write = 4,
  JumpIfTrue = 5,
  JumpIfFalse = 6,
  LessThan = 7,
  Equals = 8,
  Halt = 99
}

export const isOpCode = (code: number): code is OpCode => {
  switch (code) {
    case OpCode.Add:
    case OpCode.Multiply:
    case OpCode.Read:
    case OpCode.Write:
    case OpCode.JumpIfTrue:
    case OpCode.JumpIfFalse:
    case OpCode.LessThan:
    case OpCode.Equals:
    case OpCode.Halt:
      return true;

    default:
      return false;
  }
};

export const opLength = (code: OpCode): number => {
  switch (code) {
    case OpCode.Add:
    case OpCode.Multiply:
    case OpCode.LessThan:
    case OpCode.Equals:
      return 4;

    case OpCode.JumpIfTrue:
    case OpCode.JumpIfFalse:
      return 3;

    case OpCode.Read:
    case OpCode.Write:
      return 2;

    case OpCode.Halt:
      return 1;

    default:
      return 4;
  }
};

export enum ParameterMode {
  Position = 0,
  Immediate = 1
}

type Op = {
  code: OpCode;
  parameterModes: Array<ParameterMode>;
};

export const parseOp = (op: number): Op => {
  const digits = String(op).split("");
  const code = Number([digits.pop(), digits.pop()].reverse().join(""));
  const modeFlags = [...digits].reverse();

  if (!isOpCode(code)) {
    throw new Error(`Invalid opCode: ${code}`);
  }

  const parameterCount = opLength(code) - 1;

  const parameterModes = range(parameterCount).map(
    (i: number): ParameterMode => {
      const mode = modeFlags[i] || "0";

      if (mode === "0") {
        return ParameterMode.Position;
      }

      if (mode === "1") {
        return ParameterMode.Immediate;
      }

      throw new Error(`Invalid ParameterMode: ${mode}`);
    }
  );

  return { code, parameterModes };
};

export const fetch = (
  program: Memory,
  p: number,
  mode: ParameterMode
): number => {
  if (mode === ParameterMode.Immediate) {
    return program[p];
  }

  return program[program[p]];
};

export const add = (
  program: Memory,
  pc: number,
  [m1, m2]: Array<ParameterMode>
) => {
  const s1 = fetch(program, pc + 1, m1);
  const s2 = fetch(program, pc + 2, m2);

  program[program[pc + 3]] = s1 + s2;
};

export const multiply = (
  program: Memory,
  pc: number,
  [m1, m2]: Array<ParameterMode>
) => {
  const f1 = fetch(program, pc + 1, m1);
  const f2 = fetch(program, pc + 2, m2);
  program[program[pc + 3]] = f1 * f2;
};

export const read = (program: Memory, stdIn: Memory, pc: number) => {
  program[program[pc + 1]] = stdIn.shift() ?? NaN;
};

export const write = (
  program: Memory,
  stdOut: Memory,
  pc: number,
  [m1]: Array<ParameterMode>
) => {
  stdOut.push(fetch(program, pc + 1, m1));
};

export const jumpIfTrue = (
  program: Memory,
  pc: number,
  [m1, m2]: Array<ParameterMode>
): number | null => {
  const condition = fetch(program, pc + 1, m1);
  const target = fetch(program, pc + 2, m2);

  return condition !== 0 ? target : null;
};

export const jumpIfFalse = (
  program: Memory,
  pc: number,
  [m1, m2]: Array<ParameterMode>
): number | null => {
  const condition = fetch(program, pc + 1, m1);
  const target = fetch(program, pc + 2, m2);

  return condition === 0 ? target : null;
};

export const lessThan = (
  program: Memory,
  pc: number,
  [m1, m2]: Array<ParameterMode>
) => {
  const x = fetch(program, pc + 1, m1);
  const y = fetch(program, pc + 2, m2);

  program[program[pc + 3]] = x < y ? 1 : 0;
};

export const equals = (
  program: Memory,
  pc: number,
  [m1, m2]: Array<ParameterMode>
) => {
  const x = fetch(program, pc + 1, m1);
  const y = fetch(program, pc + 2, m2);

  program[program[pc + 3]] = x === y ? 1 : 0;
};

export const execute = (program: Memory, stdIn: Memory, stdOut: Memory) => {
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
        read(program, stdIn, pc);
        break;

      case OpCode.Write:
        write(program, stdOut, pc, parameterModes);
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

const task1 = (): Array<number> => {
  const program = [...input];
  const stdIn = [1];
  const stdOut: Array<number> = [];

  execute(program, stdIn, stdOut);

  return stdOut;
};

const task2 = (): Array<number> => {
  const program = [...input];
  const stdIn = [5];
  const stdOut: Array<number> = [];

  execute(program, stdIn, stdOut);

  return stdOut;
};

export const solution = () => {
  console.log(`05-1: ${task1()}`);
  console.log(`05-2: ${task2()}`);
};
