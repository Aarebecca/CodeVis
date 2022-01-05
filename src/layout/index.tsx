import React, { useState, useEffect, useMemo } from "react";
import { Layout } from "antd";
import { VarFlow } from "../var-flow";
import { Panel } from "../panel";
import "antd/dist/antd.css";

import type { FunctionList, StatementColor } from "../types";

const { Header, Footer, Sider, Content } = Layout;

export type UILayoutProps = {};

const UILayout: React.FC<UILayoutProps> = (props) => {
  const code = `function f(node) {
  const list = [node];
  const a = 1;
  const [b,, h = 2, [j], ...c] = o;
  const {
    d,
    e,
    g = 1,
    k: {
      z
    },
    ...f2
  } = k2;
  let [path, ...rest] = node.parentPath;
  let [pa, ...re] = path;

  while (path) {
    list.unshift(path);
    path = path.parentPath;
  }

  return list;
}`;

  // the functions parse from uploaded file
  const [functionsState, setFunctionsState] = useState<FunctionList>({
    available: [],
    functions: [],
    normalized: [],
  });

  // the current code display in the editor
  const [codeState, setCodeState] = useState<string>("");

  // the filter switch state of function list
  const [filterState, setFilterState] = useState<boolean>(false);

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

  // const codeStr = useMemo(() => {
  //   if (formatterState) {
  //     // return functionsState.functions[codeState].formatted;
  //   }
  // }, [functionsState, codeState, formatterState]);

  return (
    <Layout>
      <Header>header</Header>
      <Layout>
        <Sider width="15%">
          <Panel {...panelProps} />
        </Sider>
        <Content>
          <div style={{ width: "600px", height: "900px" }}>
            <VarFlow code={code}></VarFlow>
          </div>
        </Content>
        <Sider>right sidebar</Sider>
      </Layout>
      <Footer>footer</Footer>
    </Layout>
  );
};

export { UILayout };
