/**
 * Get the CSS time ('3s', '30ms', etc) as the total number of milliseconds.
 * @param {string} input
 * @returns {number}
 */
export function cssTimeToMilliseconds(input: string): number {
  return input.endsWith('ms') ? parseFloat(input) : parseFloat(input) * 1000;
}

/**
 * Get a numerically formatted string for a number. E.g. `1000` returns `1k`.
 * @param {number} number
 * @returns {string}
 */
export function getFormattedNumber(number: number): string {
  return number < 1000 ? `${number}` : `${(number / 1000).toFixed(1)}k`;
}

/**
 * Get a random bit based on the probability value.
 * @param {object} param
 * @param {number} param.probability
 * @returns {number}
 */
export function getRandomBit({ probability = 0.5 }: { probability: number }): number {
  return +getRandomBool({ probability });
}

/**
 * Get a random bit boolean on the probability value.
 * @param {object} param
 * @param {number} param.probability
 * @returns {boolean}
 */
export function getRandomBool({ probability = 0.5 }: { probability: number }): boolean {
  return Math.random() < probability;
}

/**
 * Get a random bit boolean on the probability value.
 * @param {object} param
 * @param {number} param.min
 * @param {number} param.max
 * @returns {number}
 */
export function getRandomNumber({ min = 1, max = 1 }: { min?: number; max?: number }): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a pluralized string if the count is not 1
 * @param {string} string The string to pluralize `(ex. "Apple")`
 * @param {[]|number} arrayOrNumber The count to compare with `(ex. 6)`
 * @returns {string} The pluralized string `(ex. "Apples")`
 */
export function pluralizeString(string: string, arrayOrNumber: [] | number): string {
  const result = Array.isArray(arrayOrNumber) ? arrayOrNumber.length : arrayOrNumber;
  return result != 1 ? `${string}s` : string;
}
