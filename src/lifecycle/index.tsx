import * as d3 from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getNodesCollapseState, matchNode, pipeline } from "./utils";
import { LifeCycleDiagram } from "./lifecycle";
import { message as Message } from "antd";
import { query } from "../utils";

import type {
  LifeCycleProps,
  LifeCycleData,
  LifeCycleNode,
  D3Selection,
} from "./types";

export const LifeCycle: React.FC<LifeCycleProps> = (props) => {
  const lifeCycleRef = useRef<SVGSVGElement>(null);

  const { code, colorMap, maxLine, lineNumber } = props;

  const width = 50;
  const height = 500;

  const [dataState, setDataState] = useState<LifeCycleData | undefined>();

  const [elState, setElState] = useState<d3.Selection<any, any, any, any>[]>(
    []
  );

  // 从 data 中获取节点初始状态
  const [collapseCfgState, setCollapseCfgState] = useState<
    [LifeCycleNode, boolean][]
  >([]);

  // 查询渲染数据
  useEffect(() => {
    query("lifecycle", { code }).then(({ status, data, message }) => {
      if (status === "ok") {
        setDataState(data);
        console.log(getNodesCollapseState(data));

        setCollapseCfgState(getNodesCollapseState(data));
      } else {
        Message.error(`Failed to query lifecycle data: ${message}`);
      }
    });
  }, [code]);

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

    console.log("firstCollapseNode", _, nodes);

    const newState: [LifeCycleNode, boolean][] = collapseCfgState.map(
      ([n, c]) => {
        if (_) {
          if (matchNode(_, n)) {
            return [n, collapse === undefined ? !c : collapse];
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
      tooltip: d3.select("#tooltip"),
      width,
      height,
    });
  }, [colorMap, maxLine]);

  useEffect(() => {
    if (!dataState) return;

    const clearEl = () => {
      elState.forEach((el) => el.remove());
      setElState([]);
    };

    let lN: D3Selection | undefined;

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

    pipeline(dataState, collapseCfgState).forEach((d, i) => {
      addEl(d, i * width);
    });

    if (lineNumber) {
      lN = lC.addLineNumber(d3.select(lifeCycleRef.current), [0, 9]);
      lN.attr("transform", `translate(10, 0)`);
    }

    return () => {
      clearEl();
      lN && lN.remove();
    };
  }, [lifeCycleRef, lC, dataState, collapseCfgState]);

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
