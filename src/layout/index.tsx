import React from "react";
import { Layout } from "antd";
import { VarFlow } from "../var-flow";
import "antd/dist/antd.css";
const { Header, Footer, Sider, Content } = Layout;

export interface IUILayout {}

const UILayout: React.FC<IUILayout> = (props) => {
  const code = `function foo(a, b) {
  return a + b;
}`;

  return (
    <Layout>
      <Header>header</Header>
      <Layout>
        <Sider>left sidebar</Sider>
        <Content>
          <div style={{ width: "1000px", height: "800px" }}>
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
