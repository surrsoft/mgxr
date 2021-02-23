/**
 * ID [210217114100], rev.1.0 2021-02-17 JS
 */
export function isEmptyOrWhitespaces(str: string): boolean {
  return (!str || str.length === 0 || /^\s*$/.test(str))
}
