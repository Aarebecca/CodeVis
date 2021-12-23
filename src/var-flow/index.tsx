import * as d3 from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CodeEditor } from "../editor";
import { createConnectionPath } from "./utils";
import { Modal } from "antd";
import { query } from "../utils";
import "./style.scss";
import {
  getLineHeight,
  measureEditorText,
  lineCol2Position,
} from "../editor/utils";

import type { Selection } from "d3";
import type { CodeEditorInstance } from "../editor/types";
import type { IVarFlow, CodeColor } from "./types";
import type { Point } from "../types";

const defaultColorClassRuler = (color: string) => {
  return color.replaceAll(", ", "-").replaceAll("(", "-").replaceAll(")", "");
};

const VarFlow: React.FC<IVarFlow> = (props) => {
  const { code } = props;
  const { colorClassNameRule = defaultColorClassRuler } = props;

  const varFlowRef = useRef<SVGSVGElement>(null);
  const [dataState, setDataState] = useState<CodeColor[]>();
  const [editorInstance, setEditorInstance] = useState<CodeEditorInstance>();
  const [flowPathState, setFlowPathState] = useState<
    Selection<SVGPathElement, unknown, null, undefined>[]
  >([]);

  /**
   * query var flow data
   */
  useEffect(() => {});

  /**
   * draw var flow
   */
  useEffect(() => {
    const svg = d3.select(varFlowRef.current);

    function removeFlowPath() {
      flowPathState.forEach((path) => path.remove());
      setFlowPathState([]);
    }

    function addFlowPath(from: Point, to: Point) {
      if (editorInstance && editorInstance.editor) {
        const path = createConnectionPath(editorInstance.editor, from, to);
        const pathSelection = svg
          .insert("path")
          .attr("d", path)
          .attr(
            "style",
            "fill:none;stroke:red;stroke-width=6px;cursor: default;marker-end: url(#arrow);"
          );
        setFlowPathState((curr) => [...curr, pathSelection]);
      }
    }

    removeFlowPath();
    addFlowPath([1, 14], [2, 10]);
    addFlowPath([2, 14], [2, 20]);
    return removeFlowPath;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [varFlowRef, editorInstance]);

  /**
   * query decorator data
   */
  useEffect(() => {
    const {
      code,
      nodeColor = {
        // BlockStatement: "#f0f2f5",
        // ReturnStatement: "#ff6c37",
        // VariableDeclarator: "#e5fff1",
        VariableDefinition: "red",
        VariableMention: "green",
      },
    } = props;
    query("heatMap", {
      code,
      nodeColor,
    }).then(({ status, data, message }) => {
      if (status === "ok") {
        setDataState(data);
        console.log(data);
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
    const { editor } = editorInstance;
    const layoutInfo = editor.getLayoutInfo();
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
      // backgroundColor: "rgb(255, 0,0,0.5)",
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
