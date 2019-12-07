import difference from "lodash/difference";
import flatten from "lodash/flatten";
import flatMap from "lodash/flatMap";
import uniq from "lodash/uniq";
import sum from "lodash/sum";
import input from "./06.input.json";

type OrbitList = Array<Array<string>>;
type OrbitMap = { [source: string]: Array<string> };

export const toMap = (orbitList: OrbitList): OrbitMap =>
  orbitList.reduce(
    (acc: OrbitMap, [parent, child]: Array<string>): OrbitMap => ({
      ...acc,
      [parent]: [...(acc[parent] || []), child]
    }),
    {}
  );

export const getParents = (orbitMap: OrbitMap): Array<string> => {
  const parents = Object.keys(orbitMap);
  const children = flatten(Object.values(orbitMap));

  return difference(parents, children);
};

export const indirectOrbits = (orbitMap: OrbitMap): OrbitMap => {
  let orbits = { ...orbitMap };
  let changed = true;

  while (changed) {
    changed = false;

    Object.keys(orbits).forEach((parent: string) => {
      const children = orbits[parent];
      const grandChildren = flatMap(
        children,
        (child: string): Array<string> => orbits[child] || []
      );

      const family = uniq([...children, ...grandChildren]);

      if (family.length !== children.length) {
        orbits[parent] = family;
        changed = true;
      }
    });
  }

  return orbits;
};

export const countOrbits = (orbitMap: OrbitMap): number =>
  sum(
    Object.values(indirectOrbits(orbitMap)).map(
      (labels: Array<string>): number => labels.length
    )
  );

const task1 = (): number => countOrbits(toMap(input));

export const solution = () => {
  console.log(`06-1: ${task1()}`);
};
