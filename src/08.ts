import minBy from "lodash/minBy";
import zipWith from "lodash/zipWith";
import input from "./08.input.json";

const { image } = input;
const width = 25;
const height = 6;

export const sliceImage = (
  data: string,
  width: number,
  height: number
): Array<string> => {
  const sliceLength = width * height;

  let slices: Array<string> = [];

  for (let i = 0; i < data.length; i += sliceLength) {
    slices.push(data.slice(i, i + sliceLength));
  }

  return slices;
};

type Score = {
  zeroCount: number;
  oneCount: number;
  twoCount: number;
};

export const scoreLayer = (layer: string): Score => {
  let zeroCount = 0;
  let oneCount = 0;
  let twoCount = 0;

  for (let i = 0; i < layer.length; i++) {
    switch (layer[i]) {
      case "0":
        zeroCount++;
        break;
      case "1":
        oneCount++;
        break;
      case "2":
        twoCount++;
        break;
    }
  }

  return { zeroCount, oneCount, twoCount };
};

const task1 = (): number => {
  const scores = sliceImage(image, width, height).map(scoreLayer);
  const lowestZeros = minBy(scores, "zeroCount");

  if (!lowestZeros) {
    return NaN;
  }

  const { oneCount, twoCount } = lowestZeros;

  return oneCount * twoCount;
};

export const mergeLayers = (layers: Array<string>): string =>
  zipWith(
    ...layers.map(layer => layer.split("")),
    (...pixels: Array<string>): string => pixels.find(p => p !== "2") || "λ"
  ).join("");

export const wrapLayer = (layer: string, width: number): string => {
  let rows: Array<string> = [];

  for (let i = 0; i < layer.length; i += width) {
    rows.push(layer.slice(i, i + width));
  }

  return rows.join("\n").replace(/0/g, " ");
};

const task2 = (): string =>
  wrapLayer(mergeLayers(sliceImage(image, width, height)), width);

const solution = () => {
  console.log(`08-1: ${task1()}`);
  console.log(`08-2:\n${task2()}`);
};
