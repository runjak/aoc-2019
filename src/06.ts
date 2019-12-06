import uniq from "lodash/uniq";
import flatten from "lodash/flatten";

import {
  tensor2d,
  matMul,
  Tensor2D,
  Scalar,
  stack
} from "@tensorflow/tfjs-node";
// https://github.com/tensorflow/tfjs/tree/master/tfjs-node

import input from "./06.input.json";

type Labeling = { [label: string]: number };
type Graph = {
  labeling: Labeling;
  labelCount: number;
  // https://en.wikipedia.org/wiki/Adjacency_matrix
  adjacencyMatrix: Tensor2D;
};

export const mkGraph = (links: Array<Array<string>>): Graph => {
  const labeling = Object.fromEntries(
    uniq(flatten(links)).map((s, i) => [s, i])
  );
  const labelCount = Object.keys(labeling).length;

  const adjInput = new Array(labelCount * labelCount);
  links.forEach(([target, source]) => {
    adjInput[labeling[target] + labeling[source] * labelCount] = 1;
  });

  const adjacencyMatrix = tensor2d(adjInput, [labelCount, labelCount], "int32");

  return { labeling, labelCount, adjacencyMatrix };
};

export const directOrbits = ({ adjacencyMatrix }: Graph): Scalar =>
  adjacencyMatrix.sum();

export const transition = (adjacencyMatrix: Tensor2D): Tensor2D =>
  matMul(adjacencyMatrix, adjacencyMatrix);

export const transitions = (adjacencyMatrix: Tensor2D): Array<Tensor2D> => {
  const graphs = [];
  for (
    let a = adjacencyMatrix;
    a.sum().dataSync()[0] > 0;
    a = matMul(a, adjacencyMatrix)
  ) {
    graphs.push(a);
  }

  return graphs;
};

export const countOrbits = ({ adjacencyMatrix }: Graph): Scalar =>
  stack(transitions(adjacencyMatrix)).sum();

const task1 = () => countOrbits(mkGraph(input)).dataSync()[0];

const solution = () => {
  console.log(`06-1: ${task1()}`);
};

// solution();
