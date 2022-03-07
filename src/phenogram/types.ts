import type { Node as _Node, SourceLocation } from "@babel/types";

export type D3Selection = d3.Selection<any, any, any, any>;

export type NodeLocation = SourceLocation;

export type PhenogramProps = {
  code: string;
  colorMap: { [key: string]: string };
  /**
   * 统一的形状
   */
  shape: [number, number];
};

export type Node = _Node & {
  loc: SourceLocation;
};

export type RenderDatum = {
  // 行号
  line: number;
  // 列号
  column: number;
  // 显示颜色
  color: string;
  // 类型
  type: string[];
  nodes: Node[];
};

export type RenderData = RenderDatum[];
