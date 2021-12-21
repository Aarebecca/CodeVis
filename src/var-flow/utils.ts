import type { BezierControlPointsGenerator } from "./types";

/**
 * 计算贝塞尔控制点
 * 这里只考虑出发点在上，终点在下的情况
 */
export const bezierControlPointsGenerator: BezierControlPointsGenerator[] = [
  (x1, y1, x2, y2) => {
    const ratio = 0.5;
    const dY = y2 - y1;
    return [x1, y1 + dY * ratio, x2, y2 - dY * ratio];
  },
];

/**
 * 生成贝塞尔曲线
 */
export function bezierPathGenerator(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  generator: BezierControlPointsGenerator
): string {
  return `M ${x1},${y1} C ${generator(x1, y1, x2, y2).join(",")} ${x2},${y2}`;
}
