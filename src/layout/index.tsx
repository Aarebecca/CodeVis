import React from "react";
import { Layout } from "antd";
import { VarFlow } from "../var-flow";
import "antd/dist/antd.css";
import { CodeEditor } from "../editor";
const { Header, Footer, Sider, Content } = Layout;

export interface IUILayout {}

const UILayout: React.FC<IUILayout> = (props) => {
  const code = `function f(e) {
    for (var r = e.parentNode; r; ) {
      if ("HTML" === r.tagName) return !0;
      if (11 === r.nodeType) return !1;
      r = r.parentNode;
    }
    return !1;
  }`;

  const css = `
  .rgba-255-0-0-1 {
    background: rgba(255, 0, 0,1);
  }
  .rgba-0-255-0-1 {
    background: rgba(0, 255, 0,1);
  }
  `;

  return (
    <Layout>
      <Header>header</Header>
      <Layout>
        <Sider>left sidebar</Sider>
        <Content>
          <VarFlow data={[1]}></VarFlow>
          <div style={{ width: "500px", height: "300px" }}>
            <CodeEditor code={code} lineHeight={19} fontSize={14}></CodeEditor>
            <style>{css}</style>
          </div>
        </Content>
        <Sider>right sidebar</Sider>
      </Layout>
      <Footer>footer</Footer>
    </Layout>
  );
};

export { UILayout };
