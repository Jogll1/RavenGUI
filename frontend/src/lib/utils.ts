/**
 * Takes an array of strings and joins them into a valid className.
 *
 * @param strs an array of strings
 * @returns    a valid className
 */
export function cn(...strs: (string | undefined)[]) {
  return strs.join(' ');
}

/**
 * Evaluate a condition. Returns undefined if not given a false value.
 *
 * @param cond the condition to evaluate
 * @param t    value returned when true
 * @param f    value returned when false
 * @returns    t or f
 */
export function ev(cond: boolean, t: any, f?: any) {
  return cond ? t : (f ?? undefined);
}

/**
 * Get a random integer in range [0, max].
 *
 * @param max the upper bound
 * @returns   a random integer in range [0, max]
 */
export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

/**
 * Get a random element from a list.
 *
 * @param data the data to select from
 * @returns    a random element in the list
 */
export function getRandom(data: any[]) {
  if (data.length === 0) return null;

  return data[getRandomInt(data.length - 1)];
}
