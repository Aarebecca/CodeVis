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

export interface IVarFlow {
  code: string;
  nodeColor?: AnyObject;
  lineHeight?: number;
  colorClassNameRule?: (color: string) => string;
}
