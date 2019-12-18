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

export const toLpModel = (productions: Array<Production>) => {
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
  solveToMine(toLpModel(parseInput(getInput())));
