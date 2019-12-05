const input = "128392-643281";
const [rangeStart, rangeStop] = input.split("-").map(x => Number(x));

const toDigits = (x: number): Array<number> =>
  String(x)
    .split("")
    .map(Number);

export const doubleDigits = (digits: Array<number>): boolean => {
  const buckets: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (const d of digits) {
    buckets[d] += 1;
  }

  for (const b of buckets) {
    if (b === 2) {
      return true;
    }
  }

  return false;
};

export const monotone = (digits: Array<number>): boolean => {
  if (digits.length <= 1) {
    return true;
  }

  for (let i = 1; i < digits.length; i++) {
    if (digits[i] < digits[i - 1]) {
      return false;
    }
  }

  return true;
};

export const valid = (x: number): boolean => {
  const digits = toDigits(x);

  return doubleDigits(digits) && monotone(digits);
};

export const countKeys = (start: number, stop: number): number => {
  let count = 0;

  for (let i = start; i <= stop; i++) {
    if (valid(i)) {
      count++;
    }
  }

  return count;
};

export function solution() {
  console.log(`04-1: 2050`);
  console.log(`04-2: ${countKeys(rangeStart, rangeStop)}`);
}
