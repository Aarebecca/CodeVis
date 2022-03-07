import React, { useEffect, useMemo, useState } from "react";
import { Col, Card, Layout, Row } from "antd";
import { IconFont } from "../icon";
import { LifeCycle } from "../lifecycle";
import { Panel } from "../panel";
import { Phenogram } from "../phenogram";
import { statementColors2ColorMap } from "../utils";
import { VarFlow } from "../var-flow";
import "antd/dist/antd.css";

import type { FunctionList, StatementColor } from "../types";
import type {EditorProps} from "../editor/types"

const { Header, Sider, Content } = Layout;

export type UILayoutProps = {};

const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getStorage = (key: string, defaultValue: any) => {
  const _ = localStorage.getItem(key);
  if (_ === null) {
    return defaultValue;
  }
  return JSON.parse(_);
};

const UILayout: React.FC<UILayoutProps> = (props) => {
  // the functions parse from uploaded file
  const [functionsState, setFunctionsState] = useState<FunctionList>(
    getStorage("functionsState", {
      available: [],
      functions: [],
      normalized: [],
    })
  ); // 读缓存

  // 编辑器主题
  const [themeState, setThemeState] = useState<EditorProps["theme"]>("light");

  // the current code display in the editor
  const [codeState, setCodeState] = useState<string>("");

  // the filter switch state of function list
  const [filterState, setFilterState] = useState<boolean>(true);

  const lineHeightRange: [number, number] = [18, 40];
  // the line height of the code editor
  const [lineHeightState, setLineHeightState] = useState<number>(25);

  const fontSizeRange: [number, number] = [14, 40];
  const [fontSizeState, setFontSizeState] = useState<number>(14);

  // wether to display variable flow
  const [varFlowEnableState, setVarFlowEnableState] = useState<boolean>(true);
  const [heatMapEnableState, setHeatMapEnableState] = useState<boolean>(true);

  const [varFlowHighlightState, setVarFlowHighlightState] =
    useState<boolean>(true);

  // the statement color of the code
  const [statementColorsState, setStatementColorsState] = useState<
    StatementColor[]
  >(getStorage("statementColors", [])); // 尝试读缓存颜色

  const [arrowColorState, setArrowColorState] = useState<string>("red");

  const panelProps = {
    functionsState,
    setFunctionsState,
    themeState,
    setThemeState,
    codeState,
    setCodeState,
    arrowColorState,
    setArrowColorState,
    filterState,
    setFilterState,
    fontSizeRange,
    fontSizeState,
    setFontSizeState,
    lineHeightRange,
    lineHeightState,
    setLineHeightState,
    varFlowEnableState,
    setVarFlowEnableState,
    heatMapEnableState,
    setHeatMapEnableState,
    varFlowHighlightState,
    setVarFlowHighlightState,
    statementColorsState,
    setStatementColorsState,
  };

  // 如果更新了文件，就重置代码
  useEffect(() => {
    setStorage("functionsState", functionsState);
    setCodeState("");
  }, [functionsState]);

  // 缓存颜色
  useEffect(() => {
    setStorage("statementColors", statementColorsState);
  }, [statementColorsState]);

  const codeStr = useMemo(() => {
    const index = functionsState.functions.indexOf(codeState);
    if (index === -1) {
      return "";
    }
    return functionsState.normalized[index];
  }, [functionsState, codeState]);

  const colorMap = statementColors2ColorMap(statementColorsState);

  const fW = { width: "100%" };
  const fH = { height: "100%" };

  const fullSize = {
    ...fW,
    ...fH,
  };

  return (
    <Layout style={fullSize}>
      <Header style={{ padding: "0 0 0 10px" }}>
        <div
          style={{
            ...fullSize,
            color: "white",
            fontSize: "40px",
          }}
        >
          <IconFont type="icon-Code" />
          <span style={{ marginLeft: "20px" }}>CodeVis</span>
        </div>
      </Header>
      <Layout style={fullSize}>
        <Sider width="15%">
          <Panel {...panelProps} />
        </Sider>
        <Content style={fH}>
          <Row style={fH}>
            <Col span={10} style={fH}>
              <Card title="Variable Flow View">
                <VarFlow
                  theme={themeState}
                  code={codeStr}
                  arrowColor={[arrowColorState]}
                  colorMap={colorMap}
                  indicatorColor={["red"]}
                  fontSize={fontSizeState}
                  lineHeight={lineHeightState}
                  indicator={varFlowHighlightState}
                  varFlowEnabled={varFlowEnableState}
                  heatMapEnabled={heatMapEnableState}
                ></VarFlow>
              </Card>
            </Col>
            <Col span={8} style={fH}>
              <LifeCycle
                maxLine={16}
                colorMap={colorMap}
                code={`function getState(scrollHeight, height, offsetTop, offsetBottom) {
                  let scrollTop = this.$target.scrollTop();
                  let position = this.$element.offset();
                  let targetHeight = this.$target.height();
                  if (offsetTop != null && this.affixed === 'top') return scrollTop < offsetTop ? 'top' : false;
                  if (this.affixed === 'bottom') {
                    if (offsetTop != null) return scrollTop + this.unpin <= position.top ? false : 'bottom';
                    return scrollTop + targetHeight <= scrollHeight - offsetBottom ? false : 'bottom';
                  }
                  let initializing = this.affixed == null;
                  let colliderTop = initializing ? scrollTop : position.top;
                  let colliderHeight = initializing ? targetHeight : height;
                  if (offsetTop != null && scrollTop <= offsetTop) return 'top';
                  if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom';
                  return false;
                }`}
              />
            </Col>
            <Col span={6} style={fH}>
              <Phenogram code={""} colorMap={{}} shape={[0, 0]} />
            </Col>
          </Row>
        </Content>
        {/* <Sider>right sidebar</Sider> */}
      </Layout>
    </Layout>
  );
};

export { UILayout };
