import type { AnyObject } from "../types";
import type { EditorProps } from "../editor/types";

export type Arrow = string[];

export type Range = [number, number, number, number];

export type CodeColor = {
  type?: string;
  range: Range;
  color: string;
};

export type RangeClassColor = {
  range: Range;
  className: string;
  glyphMarginClassName: string;
};

export interface VarFlowProps {
  code: string;
  theme: EditorProps["theme"];
  arrowColor: Arrow;
  fontSize: number;
  colorMap: AnyObject;
  lineHeight?: number;
  indicator: boolean;
  varFlowEnabled: boolean;
  heatMapEnabled: boolean;
  indicatorColor: string[];
  colorClassNameRule?: (color: string) => string;
}

export type BezierControlPointsGenerator = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => [number, number, number, number];

export type VarList = {
  varList: string[];
  locList: {
    [keys: string]: Range[];
  };
};
