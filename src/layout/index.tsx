import React from "react";
import { Layout } from "antd";
import { VarFlow } from "../var-flow";
import "antd/dist/antd.css";
const { Header, Footer, Sider, Content } = Layout;

export interface IUILayout {}

const UILayout: React.FC<IUILayout> = (props) => {
  const code = `function f(node) {
  const list = [node];
  const a = 1;
  const [b, , h=2, [j],...c] = o;
  const {d, e, g=1, k:{z},...f} = k2;
  let [path, ...rest] = node.parentPath;
  let [pa, ...re] = path;
  while (path) {
    list.unshift(path);
    path = path.parentPath;
  }
  return list;
}
`;

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
