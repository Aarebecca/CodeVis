/**
 * this file is about drawing lifecycle diagram
 */
import { get, isObject, merge, set } from "lodash";
import * as d3 from "d3";
import { leastCommonMultiple, mixColor, MIXER } from "../utils";
import { nodeMatrix2TypeMatrix, TRANSPARENT_FLAG } from "./utils";

import type {
  LifeCycleNode,
  LifeCycleData,
  LifeCycleParameters,
  RatioTree,
  RenderData,
  NodeMatrix,
  TypeMatrix,
  ColorMatrix,
  D3Selection,
} from "./types";

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

function range(num: number) {
  return d3.range(num).map((i) => String(i));
}

/**
 * 一个 lifeCycle 只绘制一条
 */
export class LifeCycleDiagram {
  private defaultAttributes = {
    width: 50,
    height: 300,
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

  private attributes = {};

  constructor(params: Partial<LifeCycleParameters>) {
    merge(this.attributes, this.defaultAttributes, params);
  }

  public generate(data: LifeCycleData) {
    const { maxCols, ratioTree } = this.getNodeDetails(data);
    const nodeMat = this.nodeMat(ratioTree, maxCols);

    // convert nodeMat to typeMat
    const typeMat = nodeMatrix2TypeMatrix(nodeMat);
    const colorMat = this.colorMat(typeMat);
    const renderData = this.renderData(typeMat, colorMat, nodeMat);
    const shape: [number, number] = [colorMat.length, colorMat[0].length];
    return { maxCols, shape, typeMat, colorMat, renderData };
  }

  public render(
    el: D3Selection,
    data: LifeCycleData,
    onCollapseChange: (nodes: LifeCycleNode[], collapse?: boolean) => void
  ) {
    const { renderData, shape } = this.generate(data);
    this.renderD3Element(renderData, shape, el, onCollapseChange);
  }

  public addLineNumber(
    el: D3Selection,
    range: [number, number],
    formatter: (num: number) => string = (num) => String(num)
  ) {
    const [start, end] = range;
    const lineNumber = Array.from(
      { length: end - start + 1 },
      (_, i) => i + start
    ).map(formatter);

    const { lineScale, lineHeight } = this;

    const lN = el.append("g").attr("class", "line-number");

    lN.selectAll(".line-number-item")
      .data(lineNumber)
      .join("g")
      .attr("class", "line-number line-number-item")
      .each(function (d, i) {
        d3.select(this)
          .append("text")
          .attr("x", 0)
          .attr("y", lineScale(d)! + lineHeight / 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .text(d);
      });

    return lN;
  }

  private set(path: string | number | (string | number)[], value: any) {
    set(this.attributes, path, value);
  }

  private get innerWidth(): number {
    const { left, right } = this.get("padding");
    return this.get("width") - left - right;
  }

  private get innerHeight(): number {
    const { top, bottom } = this.get("padding");
    return this.get("height") - top - bottom;
  }

  private get innerLeftTop(): [number, number] {
    const { left, top } = this.get("padding");
    return [left, top];
  }

  private get lineHeight(): number {
    return this.innerHeight / this.get("maxLine");
  }

  private get lineScale(): d3.ScaleBand<string> {
    const [top] = this.innerLeftTop;
    return d3
      .scaleBand()
      .domain(range(this.get("maxLine")))
      .rangeRound([top, this.innerHeight])
      .padding(0);
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
      if (depth > depthLimit || inLineChildren.length === 0) {
        cols[line - 1] = Math.max(cols[line - 1] || -Infinity, bi);
        depth -= 1;

        return {
          node: _n, //depth === 1 ? null : _n,
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
     * root 节点为所有节点的根节点
     */
    const root = {
      node: {
        start: 1,
        end: this.get("maxLine"),
        loc: {
          start: {
            line: 1,
            column: 1,
          },
          end: {
            line: this.get("maxLine"),
            column: 1,
          },
        },
        type: "root",
      },
      children: [data],
    };

    /**
     * 记录下每一行各层的占比
     */
    const ratioTree: RatioTree[] = [];
    for (let line = 1; line <= this.get("maxLine"); line++) {
      ratioTree[line - 1] = getLine(root, line, depthLimit);
    }

    // 得到每一行的最小粒度 (过滤去重)
    const fCols = Array.from(new Set(cols.filter((val) => val > 1)));
    const maxCols = leastCommonMultiple(fCols);

    return {
      ratioTree,
      maxCols,
    };
  }

  /**
   * 计算混合矩阵
   * @param data 数据
   * @param depthLimit 遍历深度限制
   * @returns 混合矩阵
   */
  private nodeMat(ratioTree: RatioTree[], maxCols: number): NodeMatrix {
    const mat: LifeCycleNode[][][] = Array.from(
      { length: this.get("maxLine") },
      () => Array.from({ length: maxCols }, () => [])
    );

    /**
     * 广度优先遍历，从上向下填充
     */
    const fillLine = (
      line: number,
      width: number,
      offset: number,
      node: LifeCycleNode | null
    ) => {
      if (node) {
        for (let i = 0; i < width; i++) {
          mat[line][offset + i].push(node);
        }
      }
    };

    /**
     * 填充矩阵
     */
    ratioTree.forEach((lineData, lineIndex) => {
      const visit = (rtNode: RatioTree, relativeOffset: number = 0) => {
        const { ratio, node, children } = rtNode;
        const width = maxCols / ratio;
        fillLine(lineIndex, width, relativeOffset, node);

        children.forEach((child, i) =>
          visit(child, relativeOffset + (i * width) / children.length)
        );
      };

      visit(lineData);
    });

    return mat;
  }

  /**
   * 将节点类型矩阵转换为渲染的颜色矩阵
   * @param typeMat
   */
  private colorMat(typeMat: TypeMatrix, mixer = MIXER.geometric): ColorMatrix {
    const colorMap = this.get("colorMap");
    const colorMat: ColorMatrix = Array.from(
      { length: typeMat.length },
      () => []
    );

    typeMat.forEach((line, i) => {
      line.forEach((item, j) => {
        const colors = item
          .map((typeName) => get(colorMap, typeName, undefined))
          .filter((color) => color);

        const color = mixColor(colors, mixer);
        colorMat[i][j] = color;
      });
    });
    return colorMat;
  }

  private renderData(
    typeMat: TypeMatrix,
    colorMat: ColorMatrix,
    nodeMat: NodeMatrix
  ) {
    const renderData: RenderData = [];
    typeMat.forEach((line, i) => {
      line.forEach((types, j) => {
        renderData.push({
          line: String(i),
          col: String(j),
          color: colorMat[i][j],
          types,
          nodes: nodeMat[i][j],
          visible: colorMat[i][j] !== "rgba(0, 0, 0, 0)",
        });
      });
    });
    return renderData;
  }

  /**
   * 导出 d3 svg 绘制命令
   */
  private renderD3Element(
    data: RenderData,
    shape: [number, number],
    el: D3Selection,
    callback: (nodes: LifeCycleNode[], collapse?: boolean) => void,
    label: boolean = false
  ) {
    const [, cols] = shape;
    const [left] = this.innerLeftTop;

    const XScale = d3
      .scaleBand()
      .domain(range(cols))
      .rangeRound([left, this.innerWidth])
      .padding(0);

    /**
     * 简单的方式是每格创建一个矩形
     * ! 或者对连通区域创建 path
     */

    const g = el.insert("g").attr("class", "life-cycle");
    const gridGroup = g.insert("g").attr("class", "grid-group");
    const textGroup = g.insert("g").attr("class", "text-group");
    const tooltip = this.get("tooltip") as D3Selection | undefined;

    const grid = gridGroup
      .selectAll("grid")
      .data(data)
      .join("rect")
      .attr("class", "line")
      .attr("x", (d) => XScale(d.col)!)
      .attr("y", (d) => this.lineScale(d.line)!)
      .attr("width", XScale.bandwidth())
      .attr("height", this.lineScale.bandwidth())
      .attr("fill", (d) => d.color)
      .on("mouseover", function (event) {
        if (event.target.__data__.visible) {
          d3.select(this).transition().duration(50).attr("stroke", "white");
        }

        const items = (
          (d3.select(this).data() as any[])[0].nodes as LifeCycleNode[]
        )
          .slice(1)
          .filter((item) => item.type !== "transparent");

        if (tooltip && items.length > 0) {
          tooltip.html(
            items
              .map(
                ({ start, end, type, _type }) =>
                  `${
                    type === TRANSPARENT_FLAG ? _type : type
                  }: ${start} - ${end}`
              )
              .join("<br />")
          );
          tooltip?.style("visibility", "visible");
        }
      })
      .on("mousemove", function (event) {
        tooltip &&
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function (event) {
        d3.select(this).transition().duration(50).attr("stroke", "none");
        tooltip && tooltip.style("visibility", "hidden");
      })
      .on("click", function (event) {
        const node = (d3.select(this).data() as LifeCycleNode[])[0];
        callback(node.nodes);
      })
      .on("contextmenu", function (event) {
        event.preventDefault();
        const node = (d3.select(this).data() as LifeCycleNode[])[0];
        callback(node.nodes, true);
      });

    label &&
      textGroup
        .selectAll("type-text")
        .data(data)
        .join("text")
        .attr("x", (d) => XScale(d.col)! + XScale.bandwidth() / 2)
        .attr(
          "y",
          (d) => this.lineScale(d.line)! + this.lineScale.bandwidth() / 2
        )
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("stroke", "#000")
        .attr("fill", "#fff")
        .attr("paint-order", "stroke")
        .attr("font-size", `${this.lineScale.bandwidth() * 0.8}px`)
        .text((d) => (d.visible ? d.types.slice(-1)[0] : ""));
  }

  public get(path: string | number | (string | number)[]) {
    const _path = isObject(path) ? path : [path];
    return get(this, ["attributes", ..._path], undefined);
  }
}
