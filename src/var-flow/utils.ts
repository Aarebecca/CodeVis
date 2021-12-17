import Color from "color";
import { parse } from "@babel/parser";
import { colorMap } from "./color-map";
import traverse from "@babel/traverse";

import type { CodeColor } from "./types";

type Mixer = (index: number) => number;

/**
 * 颜色混合
 */
export function mixColor(colors: string[], mixer: Mixer): string {
  const _colors = colors.map((color) => Color(color, "rgb"));
  const sumOfWeights = colors.reduce((acc, color, index) => {
    return acc + mixer(index);
  }, 0);
  return _colors
    .reduce((acc, color, index) => {
      const weight = mixer(index) / sumOfWeights;
      return acc.mix(color, weight);
    }, _colors[0])
    .rgb()
    .toString();
}

/**
 * 混色计算
 */
export const mixer: {
  [keys: string]: Mixer;
} = {
  power: (index: number) => {
    const p = 2;
    return 1 / index ** p;
  },
  geometric: (index: number) => {
    return 1 / 2 ** index;
  },
  harmonic: (index: number) => {
    return 1 / index;
  },
};

/**
 * 遍历代码ast，记录不同位置的颜色
 */
export function createCodeColor(code: string) {
  const { astNode } = colorMap;
  const ast = parse(code);
  const codeColor: CodeColor[] = [];
  traverse(ast, {
    enter(path) {
      const color = astNode[path.node.type];
      if (color !== "") {
        codeColor.push({
          type: path.node.type,
          color,
          loc: path.node.loc!,
        });
      }
    },
  });
  return codeColor;
}

/**
 * 创建颜色矩阵
 */
function createColorMatrix(codeColor: CodeColor[], mixer: Mixer) {
  // 行数
  let lines: number = 0;
  // 列数
  let columns: number = 0;
  // 计算行列数
  codeColor.forEach(
    ({
      loc: {
        end: { line, column },
      },
    }) => {
      columns = Math.max(column, columns);
      lines = Math.max(line, lines);
    }
  );
  // 初始化矩阵
  const colorsMatrix: string[][][] = Array.from({ length: lines }, (l) =>
    Array.from({ length: columns + 1 }, (c) => [])
  );
  // 填充矩阵
  codeColor.forEach(
    ({
      type,
      loc: {
        start: { line: sl, column: sc },
        end: { line: el, column: ec },
      },
      color,
    }) => {
      for (let i = sl; i <= el; i++) {
        for (let j = sc; j < ec; j++) {
          /**
           * 行号从1开始，列号从0开始
           * 例：宽高：3行3列
           * sl=1 sc=0 el=2 ec=3
           * 则填充(0, 0)(0, 1)(0, 2)(1, 0)(1, 1)(1, 2)
           */
          colorsMatrix[i - 1][j].push(color);
        }
      }
    }
  );
  // 计算混色矩阵
  const mixMatrix = colorsMatrix.map((line) => {
    return line.map((colors) => {
      return mixColor(colors, mixer);
    });
  });

  return mixMatrix;
}
