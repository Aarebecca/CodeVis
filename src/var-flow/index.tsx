import * as d3 from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CodeEditor } from "../editor";
import { createConnectionPath, getArrowPos } from "./utils";
import { message as Message } from "antd";
import { query } from "../utils";
import "./style.scss";

import type { Selection } from "d3";
import type { CodeEditorInstance } from "../editor/types";
import type { VarFlowProps, CodeColor, VarList } from "./types";
import type { Point } from "../types";

const defaultColorClassRuler = (color: string) => {
  return color.replaceAll(", ", "-").replaceAll("(", "-").replaceAll(")", "");
};

const VarFlow: React.FC<VarFlowProps> = (props) => {
  const {
    code,
    theme,
    arrowColor,
    fontSize,
    colorMap,
    indicator,
    lineHeight,
    varFlowEnabled,
    heatMapEnabled,
    indicatorColor,
  } = props;
  const { colorClassNameRule = defaultColorClassRuler } = props;

  const varFlowRef = useRef<SVGSVGElement>(null);
  const [decoratorsDataState, setDecoratorsDataState] = useState<CodeColor[]>();
  const [editorInstance, setEditorInstance] = useState<CodeEditorInstance>();
  const [flowPathState, setFlowPathState] = useState<
    Selection<SVGPathElement, unknown, null, undefined>[]
  >([]);

  const defaultVarList = {
    locList: {},
    varList: [],
  };
  const [varListState, setVarListState] = useState<VarList>(defaultVarList);

  const markerID = (name: string) => `marker-${name}`;

  /**
   * query var flow data
   */
  useEffect(() => {
    if (code !== "") {
      query("varList", { code }).then(({ status, data, message }) => {
        if (status === "ok") {
          setVarListState(data);
        } else {
          setVarListState(defaultVarList);
          Message.error(`Failed to query variable list: ${message}`);
        }
      });
    }
  }, [code]);

  /**
   * 绘制变量箭头
   */
  useEffect(() => {
    const svg = d3.select(varFlowRef.current);

    function removeFlowPath() {
      flowPathState.forEach((path) => path.remove());
      setFlowPathState([]);
    }

    function addFlowPath(from: Point, to: Point, color: string) {
      if (editorInstance && editorInstance.editor) {
        const path = createConnectionPath(editorInstance.editor, from, to);
        const pathSelection = svg
          .insert("path")
          .attr("d", path)
          .attr(
            "style",
            `fill:none;stroke: ${color};stroke-width:2px;cursor: default;marker-end: url(#${markerID(
              color
            )});`
          );
        setFlowPathState((curr) => [...curr, pathSelection]);
      }
    }

    removeFlowPath();

    /**
     * 分别提取出每个变量的位置
     */
    if (varFlowEnabled && varListState) {
      Object.entries(varListState.locList).forEach(([varName, locList]) => {
        const varIndex = varListState.varList.indexOf(varName);
        if (locList.length > 1) {
          for (let idx = 0; idx < locList.length - 1; idx++) {
            const { from, to } = getArrowPos(locList[idx], locList[idx + 1]);
            addFlowPath(from, to, arrowColor[varIndex % arrowColor.length]);
          }
        }
      });
    }

    return removeFlowPath;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    varFlowRef,
    editorInstance,
    varListState,
    lineHeight,
    varFlowEnabled,
    arrowColor,
  ]);

  const indicatorClassName = (v: string) => `var-flow-variable-indicator-${v}`;

  /**
   * query decorator data
   */
  useEffect(() => {
    if (heatMapEnabled && code !== "") {
      query("heatMap", {
        code,
        nodeColor: colorMap,
      }).then(({ status, data, message }) => {
        if (status === "ok") {
          setDecoratorsDataState(data);
        } else {
          Message.error(`Parse failed: ${message}`);
        }
      });
    } else {
      setDecoratorsDataState([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [varFlowRef, code, colorMap, heatMapEnabled]);

  const decorators = useMemo(() => {
    if (!decoratorsDataState) return [];
    const heatMapDecorators = decoratorsDataState.map((item) => {
      const { range, color } = item;
      const className = colorClassNameRule(color);
      return {
        range,
        className,
      };
    });

    const variableIndicatorDecorators: typeof heatMapDecorators = [];

    Object.entries(varListState.locList).forEach(([name, locs]) => {
      locs.forEach((loc) => {
        variableIndicatorDecorators.push({
          range: loc,
          className: indicatorClassName(name),
        });
      });
    });

    return [...heatMapDecorators, ...variableIndicatorDecorators];
  }, [colorClassNameRule, decoratorsDataState, varListState]);

  /**
   * create decorators css
   */
  const css = useMemo(() => {
    if (!decoratorsDataState) return;
    const colorClassList = Array.from(
      new Set(decoratorsDataState.map((item) => item.color))
    );

    const variableCSS = indicator
      ? varListState.varList.map(
          (name, idx) =>
            `.${indicatorClassName(name)} { border: 1px solid ${
              indicatorColor[idx % indicatorColor.length]
            } }`
        )
      : [];

    const colorCSS = colorClassList.map((color) => {
      return `.${colorClassNameRule(color)} { background: ${color}; }`;
    });
    return [...variableCSS, ...colorCSS].join("\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    colorClassNameRule,
    decoratorsDataState,
    varListState.varList,
    arrowColor,
    indicator,
    indicatorColor,
  ]);

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
      height: "100%",
      left: `${contentLeft}px`,
      top: "0px",
    };
  }, [editorInstance]);

  const marker = (id: string, color: string, size: number) => {
    return (
      <marker
        key={id}
        id={id}
        markerUnits="strokeWidth"
        markerWidth={size}
        markerHeight={size}
        viewBox={`0 0 12 12`}
        refX="6"
        refY="6"
        orient="auto"
      >
        <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style={{ fill: color }}></path>
      </marker>
    );
  };

  return (
    <div className="var-flow">
      <div className="var-flow-container var-flow-code-editor-container">
        <CodeEditor
          code={code}
          theme={theme}
          lineHeight={lineHeight}
          fontSize={fontSize}
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
            {arrowColor.map((color) => {
              return marker(markerID(color), color, 8);
            })}
          </defs>
        </svg>
      </div>
    </div>
  );
};

export { VarFlow };
