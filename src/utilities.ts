
/**
 * Get the CSS time ('3s', '30ms', etc) as the total number of milliseconds.
 * @param {string} input
 * @returns {number}
 */
export function cssTimeToMilliseconds(input: string): number {
  return input.endsWith('ms') ? parseFloat(input) : parseFloat(input) * 1000;
}
