import * as d3 from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { bezierPathGenerator } from "./utils";
import { CodeEditor } from "../editor";
import { Modal } from "antd";
import { query } from "../utils";
import "./style.scss";
import {
  getLineHeight,
  measureEditorText,
  lineCol2Offset,
} from "../editor/utils";

import type { CodeEditorInstance } from "../editor/types";
import type { IVarFlow, CodeColor } from "./types";

const defaultColorClassRuler = (color: string) => {
  return color.replaceAll(", ", "-").replaceAll("(", "-").replaceAll(")", "");
};

const VarFlow: React.FC<IVarFlow> = (props) => {
  const { code } = props;
  const { colorClassNameRule = defaultColorClassRuler } = props;

  const varFlowRef = useRef<SVGSVGElement>(null);
  const [dataState, setDataState] = useState<CodeColor[]>();
  const [editorInstance, setEditorInstance] = useState<CodeEditorInstance>();

  useEffect(() => {
    const svg = d3.select(varFlowRef.current);
    svg
      .insert("path")
      .attr("d", "M 10,234 C 177,234 177,341 344,341")
      .attr(
        "style",
        "fill:none;stroke:white;stroke-width=6px;cursor: default;marker-end: url(#arrow);"
      );

    console.log(svg);
  });

  /**
   * query decorator data
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
      const { range, color } = item;
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

  /**
   * get editor information
   */
  useEffect(() => {
    if (!editorInstance) return;
    console.log("editorInstance", editorInstance);
    const { editor } = editorInstance;
    console.log("lineHeight", getLineHeight(editor));
    console.log("characterShape", measureEditorText(editor, " "));
    const layoutInfo = editor.getLayoutInfo();
    console.log("layoutInfo", layoutInfo);
  }, [editorInstance]);

  const svgStyle = useMemo(() => {
    if (!editorInstance) return {};
    const { editor } = editorInstance;
    /**
     * width
     * |- contentLeft
     *    |- decorationsLeft
     *        |-lineNumbersLeft / glypMarginLeft
     *        |-lineNumbersWidth
     *    |-decorationsWidth
     * |- contentWidth
     */
    const { contentLeft, contentWidth, height } = editor.getLayoutInfo();
    return {
      width: `${contentWidth}px`,
      height: `${height}px`,
      left: `${contentLeft}px`,
      top: "0px",
      backgroundColor: "rgb(255, 0,0,0.5)",
    };
  }, [editorInstance]);

  return (
    <div className="var-flow">
      <div className="var-flow-container var-flow-code-editor-container">
        <CodeEditor
          code={code}
          lineHeight={50}
          fontSize={14}
          decorations={decorators}
          getEditorInstance={setEditorInstance}
        />
        <style>{css}</style>
      </div>
      <div
        className="var-flow-container var-flow-graph-container"
        style={svgStyle}
      >
        <svg ref={varFlowRef} className="var-flow-graph">
          <defs>
            <marker
              id="arrow"
              markerUnits="strokeWidth"
              markerWidth="12"
              markerHeight="12"
              viewBox="0 0 12 12"
              refX="6"
              refY="6"
              orient="auto"
            >
              <path
                d="M2,2 L10,6 L2,10 L6,6 L2,2"
                style={{ fill: "#f00" }}
              ></path>
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export { VarFlow };
