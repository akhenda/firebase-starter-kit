export function sum(...args: number[]) {
  return args.reduce((total, num) => total + num, 0);
}
