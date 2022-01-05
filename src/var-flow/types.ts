import { AnyObject } from "../types";

export type CodeColor = {
  type?: string;
  range: [number, number, number, number];
  color: string;
};

export type RangeClassColor = {
  range: [number, number, number, number];
  className: string;
  glyphMarginClassName: string;
};

export interface VarFlowProps {
  code: string;
  statementColor?: AnyObject;
  lineHeight?: number;
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
    [keys: string]: [number, number, number, number][];
  };
};
