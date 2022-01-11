export function leastCommonMultiple(arr: number[]) {
  function gcd(a: number, b: number): number {
    return !b ? a : gcd(b, a % b);
  }

  function lcm(a: number, b: number) {
    return (a * b) / gcd(a, b);
  }

  var multiple = 1;
  arr.forEach(function (n) {
    multiple = lcm(multiple, n);
  });

  return multiple;
}
