import { HierarchyNode } from "d3";
import type { SourceLocation } from "@babel/types";
import type { AnyObject } from "../types";

export type D3Selection = d3.Selection<any, any, any, any>;

export type lineNumberCfg = {
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  fontStyle?: string;
  fontWeight?: string;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
};

export type LifeCycleProps = {
  code: string;
  colorMap: AnyObject;
  maxLine: number;
  lineNumber?: boolean;
};

/**
 * 变量生命周期图
 * 纵轴，时段（单位：代码行数）
 */
export interface LifeCycleParameters {
  /**
   * 容器宽度
   */
  width: number;
  /**
   * 容器高度
   */
  height: number;
  /**
   * 内边距
   */
  padding: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  // 遍历深度
  depth: number;
  /**
   * 纵轴最大数量 (行数)
   */
  maxLine: number;
  /**
   * 横轴最大数量 (列数)
   * 基于 width height padding maxLine maxCols 计算出每格的像素值
   */
  maxCols: number;
  /**
   * 每种类型的节点颜色
   */
  colorMap: AnyObject;

  // tooltip handle
  tooltip?: D3Selection;
}

/**
 * 变量生命周期图数据结构
 */
export interface LifeCycleNode {
  /**
   * 起始行
   */
  start: number;
  /**
   * 结束行
   */
  end: number;
  /**
   * 节点类型（statement）
   */
  type: string;
  loc: SourceLocation;
  [keys: string]: any;
}

export interface LifeCycleData {
  node: LifeCycleNode;
  /**
   * parent - children 表示层级结构
   * 如果同属一个节点的 children，则为并列关系
   */
  [keys: string]: any;
  children: LifeCycleData[];
}

export type HierarchyLifeCycleData = HierarchyNode<LifeCycleNode>;

export type RatioTree = {
  ratio: number;
  node: LifeCycleNode | null;
  children: RatioTree[];
};

export type NodeMatrix = LifeCycleNode[][][];

export type TypeMatrix = string[][][];

export type ColorMatrix = string[][];

export type RenderData = {
  // 行号
  line: string;
  // 列号
  col: string;
  // 颜色
  color: string;
  // 所属类型
  types: string[];
  // 是否可见
  visible: boolean;
  /**
   * node 索引
   */
  nodes: LifeCycleNode[];
}[];
