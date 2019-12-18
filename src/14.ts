import fs from "fs";
// @ts-ignore FIXME get the typing right
import { Solve, Model } from "javascript-lp-solver/src/main";

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
  return {
    optimize: "mine",
    opType: "min",
    constraints: {
      FUEL: { min: 1 },
      ORE: { min: 0 },
      A: { min: 0 },
      B: { min: 0 },
      C: { min: 0 },
      D: { min: 0 },
      E: { min: 0 }
    },
    variables: {
      mine: { ORE: 1 },
      FUEL: { FUEL: 1, E: -1, A: -7 },
      E: { E: 1, D: -1, A: -7 },
      D: { D: 1, C: -1, A: -7 },
      C: { C: 1, B: -1, A: -7 },
      B: { B: 1, ORE: -1 },
      A: { A: 10, ORE: -10 }
    },
    ints: {
      FUEL: 1,
      ORE: 1,
      A: 1,
      B: 1,
      C: 1,
      D: 1,
      E: 1
    }
  };
};

console.log(Solve(toLpModel([])));
