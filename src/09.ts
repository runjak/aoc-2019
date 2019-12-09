import { Memory, parseOp, opLength, ParameterMode, OpCode } from "./05";
import boostProgram from "./09.input.json";

type State = {
  memory: Memory;
  pc: number;
  relativeBase: number;
};

type StdIn = () => Promise<number>;
type StdOut = (x: number) => Promise<void>;

type Fetch = (p: number, mode: ParameterMode) => number;
type Store = (p: number, mode: ParameterMode, value: number) => void;

export const mkState = (code: Memory): State => ({
  memory: [...code],
  pc: 0,
  relativeBase: 0
});

export const mkFetch = (state: State): Fetch => (
  p: number,
  mode: ParameterMode
): number => {
  const { memory, relativeBase } = state;
  const immediate = memory[p] || 0;

  switch (mode) {
    case ParameterMode.Immediate:
      return immediate;

    case ParameterMode.Relative:
      return memory[relativeBase + immediate] || 0;

    case ParameterMode.Position:
    default:
      return memory[immediate] || 0;
  }
};

export const mkStore = (state: State): Store => (
  p: number,
  mode: ParameterMode,
  value: number
): void => {
  const { memory, relativeBase } = state;
  const immediate = memory[p] || 0;

  switch (mode) {
    case ParameterMode.Immediate:
      memory[immediate] = value;
      break;

    case ParameterMode.Relative:
      memory[relativeBase + immediate] = value;
      break;

    case ParameterMode.Position:
      memory[memory[immediate]] = value;
      break;
  }
};

export const mkAdd = (state: State, fetch: Fetch, store: Store) => ([
  m1,
  m2,
  m3
]: Array<ParameterMode>) => {
  const { pc } = state;

  const s1 = fetch(pc + 1, m1);
  const s2 = fetch(pc + 2, m2);
  store(pc + 3, m3, s1 + s2);

  state.pc += opLength(OpCode.Add);
};

export const mkMultiply = (state: State, fetch: Fetch, store: Store) => ([
  m1,
  m2,
  m3
]: Array<ParameterMode>) => {
  const { pc } = state;

  const f1 = fetch(pc + 1, m1);
  const f2 = fetch(pc + 2, m2);
  store(pc + 3, m3, f1 * f2);

  state.pc += opLength(OpCode.Multiply);
};

export const mkRead = (state: State, store: Store, stdIn: StdIn) => async ([
  mode
]: Array<ParameterMode>) => {
  const x = await stdIn();
  store(state.pc + 1, mode, x);
  state.pc += opLength(OpCode.Read);
};

export const mkWrite = (state: State, fetch: Fetch, stdOut: StdOut) => async ([
  mode
]: Array<ParameterMode>) => {
  const x = fetch(state.pc + 1, mode);
  await stdOut(x);
  state.pc += opLength(OpCode.Write);
};

export const mkJumpIfTrue = (state: State, fetch: Fetch) => ([m1, m2]: Array<
  ParameterMode
>) => {
  const { pc } = state;
  const condition = fetch(pc + 1, m1);
  const target = fetch(pc + 2, m2);

  if (condition !== 0) {
    state.pc = target;
  } else {
    state.pc += opLength(OpCode.JumpIfTrue);
  }
};

export const mkJumpIfFalse = (state: State, fetch: Fetch) => ([m1, m2]: Array<
  ParameterMode
>) => {
  const { pc } = state;
  const condition = fetch(pc + 1, m1);
  const target = fetch(pc + 2, m2);

  if (condition === 0) {
    state.pc = target;
  } else {
    state.pc += opLength(OpCode.JumpIfFalse);
  }
};

export const mkLessThan = (state: State, fetch: Fetch, store: Store) => ([
  m1,
  m2,
  m3
]: Array<ParameterMode>) => {
  const { pc } = state;
  const x = fetch(pc + 1, m1);
  const y = fetch(pc + 2, m2);

  store(pc + 3, m3, x < y ? 1 : 0);

  state.pc += opLength(OpCode.LessThan);
};

export const mkEquals = (state: State, fetch: Fetch, store: Store) => ([
  m1,
  m2,
  m3
]: Array<ParameterMode>) => {
  const { pc } = state;
  const x = fetch(pc + 1, m1);
  const y = fetch(pc + 2, m2);

  store(pc + 3, m3, x === y ? 1 : 0);

  state.pc += opLength(OpCode.Equals);
};

export const mkAdjustRelativeBase = (state: State, fetch: Fetch) => ([
  mode
]: Array<ParameterMode>) => {
  const x = fetch(state.pc + 1, mode);
  state.relativeBase += x;
  state.pc += opLength(OpCode.AdjustRelativeBase);
};

export const execute = async (
  state: State,
  stdIn: () => Promise<number>,
  stdOut: (n: number) => Promise<void>
): Promise<void> => {
  const fetch = mkFetch(state);
  const store = mkStore(state);

  const add = mkAdd(state, fetch, store);
  const multiply = mkMultiply(state, fetch, store);
  const read = mkRead(state, store, stdIn);
  const write = mkWrite(state, fetch, stdOut);
  const jumpIfTrue = mkJumpIfTrue(state, fetch);
  const jumpIfFalse = mkJumpIfFalse(state, fetch);
  const lessThan = mkLessThan(state, fetch, store);
  const equals = mkEquals(state, fetch, store);
  const adjustRelativeBase = mkAdjustRelativeBase(state, fetch);

  while (true) {
    const { code, parameterModes } = parseOp(state.memory[state.pc]);

    switch (code) {
      case OpCode.Add:
        add(parameterModes);
        break;

      case OpCode.Multiply:
        multiply(parameterModes);
        break;

      case OpCode.Read:
        await read(parameterModes);
        break;

      case OpCode.Write:
        await write(parameterModes);
        break;

      case OpCode.JumpIfTrue:
        jumpIfTrue(parameterModes);
        break;

      case OpCode.JumpIfFalse:
        jumpIfFalse(parameterModes);
        break;

      case OpCode.LessThan:
        lessThan(parameterModes);
        break;

      case OpCode.Equals:
        equals(parameterModes);
        break;

      case OpCode.AdjustRelativeBase:
        adjustRelativeBase(parameterModes);
        break;

      case OpCode.Halt:
      default:
        return;
    }
  }
};
