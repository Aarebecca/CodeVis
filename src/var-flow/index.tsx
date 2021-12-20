import * as d3 from "d3";
import React, { useRef, useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import { query, queryAsync } from "../utils";
import { CodeEditor } from "../editor";
import "./style.scss";

import type { IVarFlow, CodeColor } from "./types";

const defaultColorClassRuler = (color: string) => {
  return color.replaceAll(", ", "-").replaceAll("(", "-").replaceAll(")", "");
};

const VarFlow: React.FC<IVarFlow> = (props) => {
  const { code } = props;
  const { colorClassNameRule = defaultColorClassRuler } = props;

  const varFlowRef = useRef<SVGSVGElement>(null);
  const [dataState, setDataState] = useState<CodeColor[]>();

  useEffect(() => {
    const svg = d3.select(varFlowRef.current);
  });

  /**
   * query data
   */
  useEffect(() => {
    const {
      code,
      nodeColor = { BlockStatement: "yellow", ReturnStatement: "green" },
    } = props;
    query("varFlow", {
      code,
      nodeColor,
    }).then(({ status, data, message }) => {
      if (status === "ok") {
        setDataState(data);
      } else {
        Modal.error({
          title: "解析失败",
          content: message,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [varFlowRef, code, props.nodeColor]);

  const decorators = useMemo(() => {
    if (!dataState) return [];
    return dataState.map((item) => {
      const { type, range, color } = item;
      const className = colorClassNameRule(color);
      return {
        range,
        className,
      };
    });
  }, [colorClassNameRule, dataState]);

  /**
   * create decorators css
   */
  const css = useMemo(() => {
    if (!dataState) return;
    const colorClassList = Array.from(
      new Set(dataState.map((item) => item.color))
    );
    return colorClassList
      .map((color) => {
        return `.${colorClassNameRule(color)} { background: ${color}; }`;
      })
      .join("\n");
  }, [colorClassNameRule, dataState]);

  return (
    <div className="var-flow">
      <div className="var-flow-container var-flow-code-editor-container">
        <CodeEditor
          code={code}
          lineHeight={19}
          fontSize={14}
          decorations={decorators}
        />
        <style>{css}</style>
      </div>
      <div className="var-flow-container var-flow-graph-container">
        <svg ref={varFlowRef} className="var-flow-graph" />
      </div>
    </div>
  );
};

export { VarFlow };
