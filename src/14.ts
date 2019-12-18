import fs from "fs";

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
