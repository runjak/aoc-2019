import { Memory, parseOp, opLength, ParameterMode, OpCode } from "./05";
import boostProgram from "./09.input.json";

type State = {
  memory: Memory;
  pc: number;
  relativeBase: number;
};

export type StdIn = () => Promise<number>;
export type StdOut = (x: number) => Promise<void>;

export type Fetch = (p: number, mode: ParameterMode) => number;
export type Store = (p: number, mode: ParameterMode, value: number) => void;

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
    case ParameterMode.Position:
      memory[immediate] = value;
      break;

    case ParameterMode.Immediate:
      memory[p] = value;
      break;

    case ParameterMode.Relative:
      memory[relativeBase + immediate] = value;
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

export const mkAccess = (state: State) => ({
  fetch: mkFetch(state),
  store: mkStore(state)
});

export const mkCommandHandlers = (
  state: State,
  fetch: Fetch,
  store: Store,
  stdIn: StdIn,
  stdOut: StdOut
) => ({
  add: mkAdd(state, fetch, store),
  multiply: mkMultiply(state, fetch, store),
  read: mkRead(state, store, stdIn),
  write: mkWrite(state, fetch, stdOut),
  jumpIfTrue: mkJumpIfTrue(state, fetch),
  jumpIfFalse: mkJumpIfFalse(state, fetch),
  lessThan: mkLessThan(state, fetch, store),
  equals: mkEquals(state, fetch, store),
  adjustRelativeBase: mkAdjustRelativeBase(state, fetch)
});

export const execute = async (
  state: State,
  stdIn: () => Promise<number>,
  stdOut: (n: number) => Promise<void>,
  createAccess: typeof mkAccess = mkAccess,
  createCommandHandlers: typeof mkCommandHandlers = mkCommandHandlers
): Promise<State> => {
  const { fetch, store } = createAccess(state);

  const {
    add,
    multiply,
    read,
    write,
    jumpIfTrue,
    jumpIfFalse,
    lessThan,
    equals,
    adjustRelativeBase
  } = createCommandHandlers(state, fetch, store, stdIn, stdOut);

  while (true) {
    if (state.pc > state.memory.length) {
      return state;
    }

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
        state.pc += opLength(code);
      default:
        return state;
    }
  }
};

export const task1 = async (): Promise<Array<number>> => {
  const stdIn = [1];
  const stdOut: Array<number> = [];

  await execute(
    mkState(boostProgram),
    async () => {
      if (stdIn.length > 0) {
        return stdIn.shift();
      }

      throw new Error("unexpected stdIn");
    },
    async n => {
      stdOut.push(n);
    }
  );

  return stdOut;
};

export const task2 = async (): Promise<Array<number>> => {
  const stdIn = [2];
  const stdOut: Array<number> = [];

  await execute(
    mkState(boostProgram),
    async () => {
      if (stdIn.length > 0) {
        return stdIn.shift();
      }

      throw new Error("unexpected stdIn");
    },
    async n => {
      stdOut.push(n);
    }
  );

  return stdOut;
};
