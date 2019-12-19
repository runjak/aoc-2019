import fs from "fs";
// @ts-ignore FIXME get the typing right
import * as solver from "javascript-lp-solver";

const getInput = () => String(fs.readFileSync("./src/14.input.txt"));

type Product = {
  name: string;
  quantity: number;
};

type Production = {
  from: Array<Product>;
  to: Product;
};

export const parseProduct = (input: string): Product => {
  const [qString, name] = input.split(" ");

  return { name, quantity: Number(qString) };
};

export const parseInput = (input: string): Array<Production> =>
  input.split("\n").map(
    (line: string): Production => {
      const [fromString, toString] = line.split(" => ");

      const to = parseProduct(toString);
      const from = fromString.split(", ").map(parseProduct);

      return { from, to };
    }
  );

export const toOreModel = (productions: Array<Production>) => {
  const targetNames = productions.map(({ to: { name } }) => name);

  return {
    optimize: "mine",
    opType: "min",
    constraints: {
      ...Object.fromEntries(targetNames.map(name => [name, { min: 0 }])),
      FUEL: { min: 1 },
      ORE: { min: 0 }
    },
    variables: {
      ...Object.fromEntries(
        productions.map(({ to, from }: Production): [string, object] => {
          return [
            to.name,
            {
              ...Object.fromEntries(
                from.map(({ name, quantity }: Product): [string, number] => [
                  name,
                  -quantity
                ])
              ),
              [to.name]: to.quantity
            }
          ];
        })
      ),
      mine: { ORE: 1 }
    },
    ints: {
      ...Object.fromEntries(targetNames.map(name => [name, 1])),
      FUEL: 1,
      ORE: 1
    },
    external: {
      solver: "lpsolve",
      binPath: "/usr/bin/lp_solve",
      tempName: "/tmp/aoc-2019.14.txt",
      args: ["-timeout", 240]
    }
  };
};

export const solveToMine = async (model: unknown): Promise<number> => {
  const result = await solver.Solve(model);

  return Number(result.mine) ?? NaN;
};

export const task1 = (): Promise<number> =>
  solveToMine(toOreModel(parseInput(getInput())));

export const toFuelModel = (productions: Array<Production>) => {
  const trillion = 1000000000000;

  const targetNames = productions.map(({ to: { name } }) => name);

  return {
    optimize: "FUEL",
    opType: "max",
    constraints: {
      ...Object.fromEntries(targetNames.map(name => [name, { min: 0 }])),
      ORE: { equal: 0 },
      mine: { equal: 1 }
    },
    variables: {
      ...Object.fromEntries(
        productions.map(({ to, from }: Production): [string, object] => {
          return [
            to.name,
            {
              ...Object.fromEntries(
                from.map(({ name, quantity }: Product): [string, number] => [
                  name,
                  -quantity
                ])
              ),
              [to.name]: to.quantity
            }
          ];
        })
      ),
      mine: { ORE: trillion }
    },
    ints: {
      ...Object.fromEntries(targetNames.map(name => [name, 1])),
      ORE: 1,
      mine: 1
    },
    external: {
      solver: "lpsolve",
      binPath: "/usr/bin/lp_solve",
      tempName: "/tmp/aoc-2019.14.txt",
      args: ["-timeout", 240, "-ac", 0.1]
    }
  };
};

export const solveToFuel = async (model: unknown): Promise<number> => {
  const result = await solver.Solve(model);

  // console.log(result);

  return Math.floor(Number(result["Value of objective function"])) ?? NaN;
};

export const task2 = (): Promise<number> =>
  solveToFuel(toFuelModel(parseInput(getInput())));
