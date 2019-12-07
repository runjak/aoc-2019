import difference from "lodash/difference";
import flatten from "lodash/flatten";
import flatMap from "lodash/flatMap";
import uniq from "lodash/uniq";
import sum from "lodash/sum";
import head from "lodash/head";
import sortBy from "lodash/sortBy";
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

export const findClosestParent = (
  indirectOrbitMap: OrbitMap,
  children: Array<string>
): string | null => {
  const commonParents: Array<[string, Array<string>]> = Object.entries(
    indirectOrbitMap
  ).filter(
    ([_, currentChildren]): boolean =>
      difference(children, currentChildren).length === 0
  );

  const closest = head(
    sortBy(commonParents, ([_, currentChildren]) => currentChildren.length)
  );

  return closest ? closest[0] : null;
};

export const connectingNodes = (
  orbitMap: OrbitMap,
  children: Array<string>
): Array<string> => {
  const indirectOrbitMap = indirectOrbits(orbitMap);
  const parent = findClosestParent(indirectOrbitMap, children);

  if (parent === null) {
    return [];
  }

  const innerNodes = Object.entries(indirectOrbitMap).filter(
    ([_, currentChildren]): boolean => !currentChildren.includes(parent)
  );

  const connectedNodes = innerNodes.filter(([_, currentChildren]) =>
    children.some((child: string): boolean => currentChildren.includes(child))
  );

  return connectedNodes.map(([p]) => p);
};

export const countTransfers = (
  orbitMap: OrbitMap,
  a: string,
  b: string
): number => connectingNodes(orbitMap, [a, b]).length - 1;

const task1 = (): number => countOrbits(toMap(input));
const task2 = (): number => countTransfers(toMap(input), "YOU", "SAN");

export const solution = () => {
  console.log(`06-1: ${task1()}`);
  console.log(`06-2: ${task2()}`);
};
