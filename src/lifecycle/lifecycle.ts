/**
 * this file is about drawing lifecycle diagram
 */
import { get, isObject, merge } from "lodash";
import * as d3 from "d3";
import { leastCommonMultiple } from "../utils";

import type { AnyObject } from "../types";

export type LifeCycleDiagramProps = {};

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
  // /**
  //  * 数据
  //  */
  // data: LifeCycleData;
  /**
   * 每种类型的节点颜色
   */
  colorMap: AnyObject;
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
}

export interface LifeCycleData {
  node: LifeCycleNode;
  /**
   * parent - children 表示层级结构
   * 如果同属一个节点的 children，则为并列关系
   */
  children: LifeCycleData[];
}

export type RatioTree = {
  ratio: number;
  node: LifeCycleNode;
  children: RatioTree[];
};

/**
 * 生成颜色矩阵
 */
export function LifeCycleMatrix() {}

/**
 * 流程：
 * 1. 生成混合矩阵 TypeMatrix (动态规划回溯？) 一个矩阵应当表示一条流
 * 2. 计算混合矩阵颜色，并映射到绘制图形的矩阵
 *  ! Parent 和 Children 为包含关系 颜色叠加
 *  ! Child 和 Child 为并列关系，如果在同一行，则对行进行分列；否则分行即可
 *  > 比如混合矩阵 形状 (1, 3, )
 *    [
 *      [ [IfStat      ] ],
 *      [ [IfStat, Call] ],
 *      [ [IfStat] ]
 *    ]，通过 colorMap，结合 Mixer 计算得到颜色矩阵(1, 3, 3(rgb/a))
 *    则绘制图形为 1*3 的矩形
 * 3. 将矩形映射到画布空间（网格坐标->像素坐标）（每一条流的宽高都是一致的）
 */

function isInLine(node: LifeCycleNode, line: number) {
  const { start, end } = node;
  return start <= line && line <= end;
}

/**
 * 一个 lifeCycle 只绘制一条
 */
export class LifeCycleDiagram {
  private defaultAttributes = {
    width: 500,
    height: 500,
    /**
     * 最大深度 （超出深度则不绘制）
     */
    depth: Infinity,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    maxLine: 10,
    colorMap: {},
  };

  constructor(params: Partial<LifeCycleParameters>) {
    merge(this.defaultAttributes, params);
  }

  public generate(data: LifeCycleData) {
    const mixMatrix = this.mixMat(data, 3);
  }

  /**
   * 从 node 中取出行数包括 n 的节点及其深度，以及该深度下有多少个符合条件的节点
   */
  private getNodeDetails(
    data: LifeCycleData,
    depthLimit: number = this.get("depth")
  ) {
    let cols: number[] = [];
    let depth = 1;
    /**
     * 计算第 line 行的最大分支数
     * @param node 节点
     * @param line 取的行数
     * @param depthLimit 限制遍历深度
     * @param bi 分支数
     */
    const getLine = (
      node: LifeCycleData,
      line: number,
      depthLimit: number = Infinity, // 限制深度
      bi: number = 1
    ): any => {
      const { children } = node;
      const inLineChildren = children.filter((child) =>
        isInLine(child.node, line)
      );
      const { node: _n } = node;
      depth += 1;
      if (depth > depthLimit - 1 || inLineChildren.length === 0) {
        cols[line - 1] = Math.max(cols[line - 1] || -Infinity, bi);
        depth -= 1;
        return {
          node: _n,
          ratio: bi,
          children: [],
        };
      }

      const l = bi * inLineChildren.length;
      const _ = {
        ratio: bi,
        node: _n,
        children: inLineChildren.map((child) =>
          getLine(child, line, depthLimit, l)
        ),
      };
      depth -= 1;
      return _;
    };

    /**
     * 记录下每一行各层的占比
     */
    const ratioTree: RatioTree[] = [];
    // for (let line = 1; line <= this.get("maxLine"); line++) {
    //   ratioTree[line - 1] = {
    //     ratio: 1,
    //     node: data.node,
    //     children: data.children
    //       .filter((child) => isInLine(child.node, line))
    //       .map((child) => getLine(child, line, depthLimit)),
    //   };
    // }

    for (let line = 1; line <= this.get("maxLine"); line++) {
      ratioTree[line - 1] = getLine(
        data,
        line,
        depthLimit
      );
    }

    // 得到每一行的最小粒度 (过滤去重)
    const fCols = Array.from(new Set(cols.filter((val) => val > 1)));
    const maxCols = leastCommonMultiple(fCols);

    /**
     * 获得第 line 行深度为 depth 的第 index 个节点的宽度占比
     * @param line 行数
     * @param depth 深度
     * @param path 索引路径
     */
    const getRatio = (line: number, path: number[] = [0]) => {
      let r = ratioTree[line - 1];
      let val: number;
      for (let i = 0; i < path.length; i++) {
        val = r.ratio;
        r = r.children[path[i]];
      }
      return 1 / val!;
    };

    return {
      ratioTree,
      maxCols,
      getRatio,
    };
  }

  /**
   * 计算混合矩阵
   * @param data 数据
   * @param depthLimit 遍历深度限制
   * @returns 混合矩阵
   */
  private mixMat(data: LifeCycleData, depthLimit: number = Infinity) {
    const { maxCols, ratioTree } = this.getNodeDetails(data, depthLimit);
    /**
     * 创建矩阵
     */
    const mat: string[][][] = Array.from({ length: this.get("maxLine") }, () =>
      Array.from({ length: maxCols }, () => [])
    );

    /**
     * 广度优先遍历，从上向下填充
     */

    const fillLine = (
      line: number,
      width: number,
      offset: number,
      nodeType: string
    ) => {
      for (let i = 0; i < width; i++) {
        mat[line][offset + i].push(nodeType);
      }
    };

    /**
     * 填充矩阵
     */
    ratioTree.forEach((lineData, lineIndex) => {
      const visit = (rtNode: RatioTree, relativeOffset: number = 0) => {
        const { ratio, node, children } = rtNode;
        const width = maxCols / ratio;
        fillLine(lineIndex, width, relativeOffset, node.type);

        children.forEach((child, i) =>
          visit(child, relativeOffset + (i * width) / children.length)
        );
      };

      visit(lineData);
    });

    return mat;
  }

  public get(path: string | number | (string | number)[]) {
    const _path = isObject(path) ? path : [path];
    return get(this, ["defaultAttributes", ..._path]);
  }
}
