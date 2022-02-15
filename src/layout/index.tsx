import React, { useState, useEffect, useMemo } from "react";
import { Col, Row, Layout } from "antd";
import { VarFlow } from "../var-flow";
import { Panel } from "../panel";
import { LifeCycle } from "../lifecycle";
import "antd/dist/antd.css";

import type { FunctionList, StatementColor } from "../types";

const { Header, Footer, Sider, Content } = Layout;

export type UILayoutProps = {};

const UILayout: React.FC<UILayoutProps> = (props) => {
  // the functions parse from uploaded file
  const [functionsState, setFunctionsState] = useState<FunctionList>({
    available: [],
    functions: [],
    normalized: [],
  });

  // the current code display in the editor
  const [codeState, setCodeState] = useState<string>("");

  // the filter switch state of function list
  const [filterState, setFilterState] = useState<boolean>(true);

  const lineHeightRange: [number, number] = [10, 30];
  // the line height of the code editor
  const [lineHeightState, setLineHeightState] = useState<number>(10);

  // wether to display variable flow
  const [varFlowEnableState, setVarFlowEnableState] = useState<boolean>(true);

  const [varFlowHighlightState, setVarFlowHighlightState] =
    useState<boolean>(true);

  // the statement color of the code
  const [statementColorsState, setStatementColorsState] = useState<
    StatementColor[]
  >([]);

  const panelProps = {
    functionsState,
    setFunctionsState,
    codeState,
    setCodeState,
    filterState,
    setFilterState,
    lineHeightRange,
    lineHeightState,
    setLineHeightState,
    varFlowEnableState,
    setVarFlowEnableState,
    varFlowHighlightState,
    setVarFlowHighlightState,
    statementColorsState,
    setStatementColorsState,
  };

  useEffect(() => {
    setCodeState("");
  }, [functionsState]);

  const codeStr = useMemo(() => {
    const index = functionsState.functions.indexOf(codeState);
    if (index === -1) {
      return "";
    }
    return functionsState.normalized[index];
  }, [functionsState, codeState]);

  return (
    <Layout>
      <Header>header</Header>
      <Layout>
        <Sider width="15%">
          <Panel {...panelProps} />
        </Sider>
        <Content>
          <Row style={{ height: "900px" }}>
            <Col span={12}>
              <VarFlow code={codeStr}></VarFlow>
            </Col>
            <Col span={12}>
              <LifeCycle
                maxLine={10}
                colorMap={{
                  A: "red",
                  B: "green",
                  C: "blue",
                  D: "pink",
                  E: "yellow",
                  EA: "#3f32a6",
                  EB: "#3ff2a0",
                  F: "orange",
                  FA: "#12faff",
                  FAA: "#681234",
                  FAB: "#fa0313",
                  G: "purple",
                }}
                data={{
                  node: { start: 1, end: 8, type: "A" }, // depth 1
                  // collapse: false,
                  children: [
                    {
                      node: { start: 2, end: 2, type: "B" }, // depth 2
                      // collapse: false,
                      children: [],
                    },
                    {
                      node: { start: 2, end: 2, type: "C" }, // depth 2
                      // collapse: true,
                      children: [],
                    },
                    {
                      node: { start: 3, end: 3, type: "D" }, // depth 2
                      // collapse: true,
                      children: [],
                    },
                    {
                      node: { start: 4, end: 5, type: "E" }, // depth 2
                      // collapse: false,
                      children: [
                        {
                          node: { start: 5, end: 5, type: "EA" }, // depth 2
                          // collapse: true,
                          children: [],
                        },
                        {
                          node: { start: 5, end: 5, type: "EB" }, // depth 2
                          // collapse: false,
                          children: [],
                        },
                      ],
                    },
                    {
                      node: { start: 4, end: 5, type: "F" }, // depth 2
                      collapse: false,
                      children: [
                        {
                          node: { start: 5, end: 5, type: "FA" }, // depth 2
                          // collapse: false,
                          children: [
                            {
                              node: { start: 5, end: 5, type: "FAA" }, // depth 2
                              // collapse: false,
                              children: [],
                            },
                            {
                              node: { start: 5, end: 5, type: "FAB" }, // depth 2
                              // collapse: true,
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      node: { start: 7, end: 8, type: "G" }, // depth 2
                      // collapse: true,
                      children: [],
                    },
                  ],
                }}
              />
            </Col>
          </Row>
        </Content>
        <Sider>right sidebar</Sider>
      </Layout>
      <Footer>footer</Footer>
    </Layout>
  );
};

export { UILayout };
