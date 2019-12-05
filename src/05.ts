import range from "lodash/range";
import last from "lodash/last";
import input from "./05.input.json";

type Memory = Array<number>;

export enum OpCode {
  Add = 1,
  Multiply = 2,
  Read = 3,
  Write = 4,
  Halt = 99
}

export const isOpCode = (code: number): code is OpCode => {
  switch (code) {
    case OpCode.Add:
    case OpCode.Multiply:
    case OpCode.Read:
    case OpCode.Write:
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
      return 4;

    case OpCode.Read:
    case OpCode.Write:
      return 2;

    case OpCode.Halt:
      return 2;

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

export const execute = (program: Memory, stdIn: Memory, stdOut: Memory) => {
  let pc = 0;

  while (true) {
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

      case OpCode.Halt:
      default:
        return;
    }

    pc += opLength(code);
  }
};

const task1 = (): number => {
  const program = [...input];
  const stdIn = [1];
  const stdOut: Array<number> = [];

  execute(program, stdIn, stdOut);

  return last(stdOut) ?? NaN;
};

const solution = () => {
  console.log(`05-1: ${task1()}`);
};
