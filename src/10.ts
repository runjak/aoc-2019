import range from "lodash/range";
import flatMap from "lodash/flatMap";
import uniqBy from "lodash/uniqBy";
import flatten from "lodash/flatten";
import maxBy from "lodash/maxBy";
import input from "./10.input.json";

type Asteroid = { x: number; y: number; visible: number };
type Field = Array<Array<Asteroid | null>>;

export const mkAsteroid = (
  x: number,
  y: number,
  char: string
): Asteroid | null => (char === "#" ? { x, y, visible: 0 } : null);

export const parseAsteroids = (lines: Array<string>): Field =>
  lines.map(
    (line: string, x: number): Array<Asteroid | null> =>
      line
        .split("")
        .map((char: string, y: number): Asteroid | null =>
          mkAsteroid(x, y, char)
        )
  );

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

export const angles = (field: Field): Array<[number, number]> => {
  const maxWidth = Math.max(...field.map(line => line.length));

  const depths = range(0, field.length + 1);
  const widths = range(-maxWidth, maxWidth + 1);

  const originalAngles = flatMap(
    depths,
    (depth: number): Array<[number, number]> =>
      widths.map((width: number): [number, number] => [depth, width])
  );

  const shortenedAngles = originalAngles.map(
    ([depth, width]: [number, number]): [number, number] => {
      const g = gcd(depth, Math.abs(width));

      if (g <= 1) {
        return [depth, width];
      }

      return [depth / g, width / g];
    }
  );

  return uniqBy(shortenedAngles, ([d, w]) => `${d},${w}`).filter(
    ([d, w]) => !(d === 0 && w <= 0)
  );
};

export const walkAngle = (
  x: number,
  [depth, width]: [number, number],
  field: Field
) => {
  if (field.length === 0) {
    return;
  }

  const asteroid = field[0][x];
  if (!asteroid) {
    return;
  }

  const maxWidth = field[0].length;

  for (
    let xi = x + width, yi = depth;
    xi >= 0 && xi < maxWidth && yi >= 0 && yi < field.length;
    xi += width, yi += depth
  ) {
    const collision = field[yi][xi];

    if (collision) {
      asteroid.visible++;
      collision.visible++;

      return;
    }
  }
};

export const walkAngles = (angles: Array<[number, number]>, field: Field) => {
  for (let startLine = 0; startLine < field.length; startLine++) {
    const subField = field.slice(startLine, field.length);
    const firstLine = subField[0];

    for (let x = 0; x < firstLine.length; x++) {
      angles.forEach(angle => {
        walkAngle(x, angle, subField);
      });
    }
  }
};

export const visibillityMap = (field: Field): Array<Array<number>> =>
  field.map(
    (line: Array<Asteroid | null>): Array<number> =>
      line.map((a: Asteroid | null): number => (a === null ? 0 : a.visible))
  );

export const maxAsteroid = (field: Field): Asteroid => {
  walkAngles(angles(field), field);

  return maxBy(flatten(field), a => (a === null ? 0 : a.visible));
};

export const task1 = (): number => maxAsteroid(parseAsteroids(input)).visible;
