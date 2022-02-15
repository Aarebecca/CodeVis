import Color from "color";

import type { AnyObject } from "../types";

export type Mixer = (index: number) => number;
/**
 * 将颜色按照混合器混合
 * @param colors 颜色数组
 * @param mixer 混合器
 * @param defaultColor 颜色解析失败后的默认颜色
 * @returns 混合后的颜色
 */
export function mixColor(
  colors: string[],
  mixer: Mixer,
  defaultColor: string = "rgba(0, 0, 0, 0)"
): string {
  if (colors.length === 0) return defaultColor;

  const _colors = colors.map((color) => Color(color, "rgb"));
  const sumOfWeights = colors.reduce((acc, color, index) => {
    return acc + mixer(index);
  }, 0);

  let [R, G, B] = [0, 0, 0];

  _colors.forEach((color, index) => {
    const [r, g, b] = color.rgb().array();
    const weight = mixer(index) / sumOfWeights;
    R += r * weight;
    G += g * weight;
    B += b * weight;
  });

  return Color.rgb(R, G, B).toString();
}

/**
 * 混色计算
 */
export const MIXER: AnyObject<Mixer> = {
  average: (index) => 1,
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
