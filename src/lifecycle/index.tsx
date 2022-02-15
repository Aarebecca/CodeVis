import * as d3 from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { LifeCycleDiagram } from "./lifecycle";
import { matchNode, getNodesCollapseState, pipeline } from "./utils";

import type {
  LifeCycleProps,
  LifeCycleData,
  LifeCycleNode,
  D3Selection,
} from "./types";

export const LifeCycle: React.FC<LifeCycleProps> = (props) => {
  const lifeCycleRef = useRef<SVGSVGElement>(null);

  const { data, colorMap, maxLine, lineNumber } = props;

  const width = 20;
  const height = 200;

  const [elState, setElState] = useState<d3.Selection<any, any, any, any>[]>(
    []
  );

  // 从 data 中获取节点初始状态
  const [collapseCfgState, setCollapseCfgState] = useState<
    [LifeCycleNode, boolean][]
  >(getNodesCollapseState(data));

  const tooltip = d3
    .select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#000")
    .style("color", "white")
    .style("border-radius", "5px")
    .style("padding", "5px")

  const onCollapseChange = (nodes: LifeCycleNode[], collapse?: boolean) => {
    // 将 nodes 中深度最低的非展开节点 (collapse === true ) 标记为展开 （暂时没想好怎么折叠）

    /**
     * 找出第一个折叠节点
     */
    const firstCollapseNode = (ns: LifeCycleNode[]) => {
      for (let n of ns) {
        for (let cfg of collapseCfgState) {
          if (matchNode(cfg[0], n)) {
            // 找到节点
            if (cfg[1]) {
              // 折叠节点
              return cfg[0];
            }
          }
        }
      }
      // 没找到
      return undefined;
    };

    const _ = firstCollapseNode(nodes);
    console.log("1", collapseCfgState, _);

    const newState: [LifeCycleNode, boolean][] = collapseCfgState.map(
      ([n, c]) => {
        if (_) {
          if (matchNode(_, n)) {
            return [n, collapse || !c];
          }
          return [n, c];
        }
        // TODO nodes 中所有的节点都展开了, 就把 nodes 最后一个非 root 节点折叠即可
        return [n, c];
      }
    );
    setCollapseCfgState(newState);
  };

  const lC = useMemo(() => {
    return new LifeCycleDiagram({
      colorMap,
      maxLine,
      tooltip,
      width: 20,
      height: 200,
    });
  }, [colorMap, maxLine]);

  useEffect(() => {
    const clearEl = () => {
      elState.forEach((el) => el.remove());
      setElState([]);
    };

    clearEl();

    const addEl = (data: LifeCycleData, x: number, y: number = 0) => {
      const diagram = d3
        .select(lifeCycleRef.current)
        .insert("g")
        .attr("transform", `translate(${x}, ${y})`)
        .attr("width", width)
        .attr("height", height);
      setElState((prev) => [...prev, diagram]);
      lC.render(diagram, data, onCollapseChange);
    };

    pipeline(data, collapseCfgState).forEach((d, i) => {
      addEl(d, i * 20);
    });

    let lN: D3Selection | undefined;

    if (lineNumber) {
      lN = lC.addLineNumber(d3.select(lifeCycleRef.current), [0, 9]);
      lN.attr("transform", `translate(10, 0)`);
    }

    return () => {
      clearEl();
      lN && lN.remove();
    };
  }, [lifeCycleRef, lC, data, collapseCfgState]);

  return (
    <>
      <svg
        ref={lifeCycleRef}
        style={{ width: "100%", height: "100%" }}
        className="life-cycle"
      ></svg>
    </>
  );
};
