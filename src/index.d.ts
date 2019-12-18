declare module "javascript-lp-solver/src/main" {
  // https://github.com/JWally/jsLPSolver#readme

  type OpType = "min" | "max";

  export type Constraint = {
    max?: number;
    min?: number;
    equal?: number;
  };

  export type Variable = {
    [attribute: string]: number;
  };

  export type Options = {
    timeout?: number;
    tolerance?: number;
  };

  export type LpSolverSetup = {
    solver: "lpsolve";
    binPath: string;
    tempName: string;
    args: Array<string | number>;
  };

  export type Model = {
    optimize: string | { [variableName: string]: OpType };
    opType: OpType;
    constraints: { [variableName: string]: Constraint };
    variables: { [variableName: string]: Variable };
    ints?: { [variableName: string]: 1 };
    external?: LpSolverSetup;
  };

  export type Result = {
    feasible: boolean;
    result: number;
    bounded: boolean;
  } & { [variableName: string]: number };

  export function Solve(model: Model): Result;
}
