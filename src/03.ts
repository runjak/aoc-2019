import { vec2 } from "gl-matrix";

import input from "./03.input.json";

enum Direction {
  Right = "R",
  Up = "U",
  Left = "L",
  Down = "D"
}

type Segment = { direction: Direction; length: number };

export function parseSegment(data: string): Segment {
  const match = data.match(/^([RULD])(\d+)$/);

  if (!match) {
    throw new Error(`Invalid segment in parseSegment("${data}")`);
  }

  return {
    // @ts-ignore direction validated by regex
    direction: match[1],
    length: Number(match[2])
  };
}

export const parseSegments = (data: string): Array<Segment> =>
  data.split(",").map(parseSegment);

export function segmentToVector({ direction, length }: Segment): vec2 {
  switch (direction) {
    case Direction.Right:
      return vec2.fromValues(length, 0);

    case Direction.Up:
      return vec2.fromValues(0, length);

    case Direction.Left:
      return vec2.fromValues(-length, 0);

    case Direction.Down:
      return vec2.fromValues(0, -length);
  }
}

export function manhattenDistance(vec: vec2): number {
  return Math.abs(vec[0]) + Math.abs(vec[1]);
}

const origin = vec2.fromValues(0, 0);

export function chainVectors(vecs: Array<vec2>): Array<vec2> {
  const chained: Array<vec2> = [];

  vecs.reduce((acc: vec2, v: vec2): vec2 => {
    const out = vec2.create();
    vec2.add(out, acc, v);

    chained.push(out);
    return out;
  }, origin);

  return chained;
}

type Line = [vec2, vec2];

// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line
// https://schteppe.github.io/p2.js/docs/files/src_math_vec2.js.html
// * getLineSegmentsIntersection
// * getLineSegmentsIntersectionFraction
export function lineIntersection([p0, p1]: Line, [p2, p3]: Line): vec2 | null {
  const s1_x = p1[0] - p0[0];
  const s1_y = p1[1] - p0[1];
  const s2_x = p3[0] - p2[0];
  const s2_y = p3[1] - p2[1];

  const s =
    (-s1_y * (p0[0] - p2[0]) + s1_x * (p0[1] - p2[1])) /
    (-s2_x * s1_y + s1_x * s2_y);
  const t =
    (s2_x * (p0[1] - p2[1]) - s2_y * (p0[0] - p2[0])) /
    (-s2_x * s1_y + s1_x * s2_y);

  if (!(s >= 0 && s <= 1 && t >= 0 && t <= 1)) {
    return null;
  }

  return vec2.fromValues(
    p0[0] + t * (p1[0] - p0[0]),
    p0[1] + t * (p1[1] - p0[1])
  );
}

export function lines(vecs: Array<vec2>): Array<Line> {
  return vecs.map((v, i) => (i === 0 ? [origin, v] : [vecs[i - 1], v]));
}

function findIntersectionsForLines(
  ls1: Array<Line>,
  ls2: Array<Line>
): Array<vec2> {
  const intersections: Array<vec2> = [];

  ls1.forEach(l1 => {
    ls2.forEach(l2 => {
      const intersection = lineIntersection(l1, l2);

      if (intersection && !vec2.equals(intersection, origin)) {
        intersections.push(intersection);
      }
    });
  });

  return intersections;
}

export function findIntersections(s1: string, s2: string): Array<vec2> {
  const ls1 = lines(chainVectors(parseSegments(s1).map(segmentToVector)));
  const ls2 = lines(chainVectors(parseSegments(s2).map(segmentToVector)));

  return findIntersectionsForLines(ls1, ls2);
}

export function findClosestIntersectionDistance(
  s1: string,
  s2: string
): number {
  return Math.min(...findIntersections(s1, s2).map(manhattenDistance));
}

const inRange = (x: number, y: number) => (z: number): boolean => {
  const upper = Math.max(x, y);
  const lower = Math.min(x, y);

  return lower <= z && z <= upper;
};

export function stepsToIntersection(
  lines: Array<Line>,
  intersection: vec2
): number {
  let steps = 0;

  for (const line of lines) {
    const [x, y] = line;

    if (
      inRange(x[0], y[0])(intersection[0]) &&
      inRange(x[1], y[1])(intersection[1])
    ) {
      steps += vec2.distance(x, intersection);
      break;
    }

    steps += vec2.distance(x, y);
  }

  return steps;
}

export function findShortestStepSumIntersection(
  s1: string,
  s2: string
): number {
  const ls1 = lines(chainVectors(parseSegments(s1).map(segmentToVector)));
  const ls2 = lines(chainVectors(parseSegments(s2).map(segmentToVector)));

  return Math.min(
    ...findIntersectionsForLines(ls1, ls2).map((intersection: vec2): number => {
      return (
        stepsToIntersection(ls1, intersection) +
        stepsToIntersection(ls2, intersection)
      );
    })
  );
}

export function solution() {
  console.log(`03-1: ${findClosestIntersectionDistance(input[0], input[1])}`);
  console.log(`03-2: ${findShortestStepSumIntersection(input[0], input[1])}`);
}
