export function createSeededRandom(seed: number) {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

export function randomInt(rand: () => number, min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

export function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}

export function pickOne<T>(rand: () => number, items: readonly T[]): T {
  return items[randomInt(rand, 0, items.length - 1)];
}
