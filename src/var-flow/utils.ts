import { lineCol2Position } from "../editor/utils";
import type { AnyObject } from "../types";
import type { BezierControlPointsGenerator } from "./types";
import type { Point } from "../types";
import type { ICodeEditor } from "../editor/types";
import type { BiasOptions } from "../editor/utils";

/**
 * 计算贝塞尔控制点
 */
export const bezierControlPointsGenerator: AnyObject<BezierControlPointsGenerator> =
  {
    vertical: (x1, y1, x2, y2) => {
      const ratio = 0.5;
      const dY = y2 - y1;
      return [x1, y1 + dY * ratio, x2, y2 - dY * ratio];
    },
    horizontal: (x1, y1, x2, y2) => {
      if (y1 === y2) {
        return [x1, y1, x2, y2];
      }

      const ratio = 0.5;
      const dX = x2 - x1;
      return [x1 + dX * ratio, y1, x2 - dX * ratio, y2];
    },
  };

/**
 * 生成贝塞尔曲线
 */
export function bezierPathGenerator(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  generator: keyof typeof bezierControlPointsGenerator = "vertical"
): string {
  return `M ${x1},${y1} C ${bezierControlPointsGenerator[generator](
    x1,
    y1,
    x2,
    y2
  ).join(",")} ${x2},${y2}`;
}

type Direction = "topBottom" | "leftRight" | "rightLeft";

/**
 * 创建连接曲线的路径
 */
export function _createConnectionPath(
  editor: ICodeEditor,
  from: Point,
  to: Point,
  direction: Direction = "topBottom"
) {
  const layout: {
    [keys: string]: [BiasOptions, BiasOptions];
  } = {
    topBottom: ["fontBottom", "fontTop"],
    leftRight: ["fontRight", "fontLeft"],
    rightLeft: ["fontLeft", "fontRight"],
  };
  const generator = {
    topBottom: "vertical",
    leftRight: "horizontal",
    rightLeft: "horizontal",
  };
  const [fromBias, toBias] = layout[direction];
  const [x1, y1] = lineCol2Position(editor, from[0], from[1], fromBias);
  const [x2, y2] = lineCol2Position(editor, to[0], to[1], toBias);
  return bezierPathGenerator(x1, y1, x2, y2, generator[direction]);
}

/**
 * 在 _createConnectionPath 的基础上自动选择direction
 */
export function createConnectionPath(
  editor: ICodeEditor,
  from: Point,
  to: Point
) {
  const [l1, c1] = from;
  const [l2, c2] = to;
  let direction: Direction = "topBottom";
  if (l1 === l2) {
    if (c1 < c2) direction = "leftRight";
    if (c2 < c1) direction = "rightLeft";
  }

  return _createConnectionPath(editor, from, to, direction);
}
