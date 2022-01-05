import React, { useState } from "react";
import { Collapse, Typography } from "antd";
import { PanelUpload } from "./upload";
import { PanelList, CollapseFilter } from "./list";
import { PanelEditorConfig } from "./code-view";
import { VariableFlow } from "./var-flow";

import {
  AppstoreOutlined,
  createFromIconfontCN,
  CloudUploadOutlined,
  EditOutlined,
  FileTextOutlined,
  SyncOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import type { FunctionList, SetState } from "../types";
import type { VariableFlowProps } from "./var-flow";
import type { CollapseFilterProps } from "./list";
import type { PanelEditorConfigProps } from "./code-view";

export type PanelProps = {
  functionsState: FunctionList;
  setFunctionsState: SetState<FunctionList>;
  codeState: string;
  setCodeState: SetState<string>;
  filterState: CollapseFilterProps["filterState"];
  setFilterState: CollapseFilterProps["setFilterState"];
  lineHeightRange: PanelEditorConfigProps["lineHeightRange"];
  lineHeightState: PanelEditorConfigProps["lineHeightState"];
  setLineHeightState: PanelEditorConfigProps["setLineHeightState"];
  varFlowEnableState: VariableFlowProps["varFlowEnableState"];
  setVarFlowEnableState: VariableFlowProps["setVarFlowEnableState"];
  varFlowHighlightState: VariableFlowProps["varFlowHighlightState"];
  setVarFlowHighlightState: VariableFlowProps["setVarFlowHighlightState"];
  statementColorsState: VariableFlowProps["statementColorsState"];
  setStatementColorsState: VariableFlowProps["setStatementColorsState"];
};

const { Text } = Typography;
const { Panel: CollapsePanel } = Collapse;

const IconFont = createFromIconfontCN({
  scriptUrl: ["//at.alicdn.com/t/font_3119243_uisd32hn8bm.js"],
});

export const Panel: React.FC<PanelProps> = (props) => {
  const {
    functionsState,
    setFunctionsState,
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
  } = props;

  const components: {
    header: {
      icon: React.ReactNode;
      title: string;
    };
    content: React.ReactNode;
    props?: {
      [keys: string]: any;
    };
  }[] = [
    {
      header: {
        icon: <CloudUploadOutlined />,
        title: "Upload",
      },
      content: (
        <PanelUpload
          onUpload={(functionList) => {
            setFunctionsState(functionList);
          }}
        />
      ),
      props: {
        style: { textAlign: "center" },
      },
    },
    {
      header: {
        icon: <UnorderedListOutlined />,
        title: "Function List",
      },
      content: (
        <PanelList
          functions={functionsState?.[filterState ? "available" : "functions"]}
          selectCallback={(functionName, key) => {
            setCodeState(key);
          }}
        />
      ),
      props: {
        extra: <CollapseFilter {...{ filterState, setFilterState }} />,
      },
    },
    {
      header: {
        icon: <FileTextOutlined />,
        title: "Editor Config",
      },
      content: (
        <PanelEditorConfig
          {...{
            lineHeightRange,
            lineHeightState,
            setLineHeightState,
          }}
        />
      ),
    },
    {
      header: {
        icon: <IconFont type="icon-curve-" />,
        title: "Variable Flow",
      },
      content: (
        <VariableFlow
          {...{
            varFlowEnableState,
            setVarFlowEnableState,
            varFlowHighlightState,
            setVarFlowHighlightState,
            statementColorsState,
            setStatementColorsState,
          }}
        />
      ),
    },
    {
      header: {
        icon: <SyncOutlined />,
        title: "Life Cycle",
      },
      content: "CollapsePanel",
    },
    {
      header: {
        icon: <AppstoreOutlined />,
        title: "Phenogram",
      },
      content: "CollapsePanel",
    },
    {
      header: {
        icon: <EditOutlined />,
        title: "Conclusion",
      },
      content: "CollapsePanel",
    },
  ];

  return (
    <Collapse style={{ userSelect: "none" }}>
      {components.map(({ header: { icon, title }, content, props }, idx) => (
        <CollapsePanel
          header={
            <Text>
              {icon}
              {` ${title}`}
            </Text>
          }
          key={String(idx)}
          showArrow={false}
          {...props}
        >
          {content}
        </CollapsePanel>
      ))}
    </Collapse>
  );
};
