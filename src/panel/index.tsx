import React from "react";
import { Collapse, Typography } from "antd";
import { PanelUpload } from "./upload";
import { PanelList, CollapseFilter } from "./list";
import { PanelEditorConfig } from "./code-view";
import { VariableFlow } from "./var-flow";
import { IconFont } from "../icon";
import { StatementColorPicker, importExport } from "./statement-color-picker";
import {
  AppstoreOutlined,
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
import type { StatementColorPickerProps } from "./statement-color-picker";

export type PanelProps = {
  functionsState: FunctionList;
  setFunctionsState: SetState<FunctionList>;
  themeState: PanelEditorConfigProps["themeState"];
  setThemeState: PanelEditorConfigProps["setThemeState"];
  codeState: string;
  setCodeState: SetState<string>;
  filterState: CollapseFilterProps["filterState"];
  setFilterState: CollapseFilterProps["setFilterState"];
  fontSizeRange: PanelEditorConfigProps["fontSizeRange"];
  fontSizeState: PanelEditorConfigProps["fontSizeState"];
  setFontSizeState: PanelEditorConfigProps["setFontSizeState"];
  lineHeightRange: PanelEditorConfigProps["lineHeightRange"];
  lineHeightState: PanelEditorConfigProps["lineHeightState"];
  setLineHeightState: PanelEditorConfigProps["setLineHeightState"];
  arrowColorState: VariableFlowProps["arrowColorState"];
  setArrowColorState: VariableFlowProps["setArrowColorState"];
  varFlowEnableState: VariableFlowProps["varFlowEnableState"];
  setVarFlowEnableState: VariableFlowProps["setVarFlowEnableState"];
  heatMapEnableState: VariableFlowProps["heatMapEnableState"];
  setHeatMapEnableState: VariableFlowProps["setHeatMapEnableState"];
  varFlowHighlightState: VariableFlowProps["varFlowHighlightState"];
  setVarFlowHighlightState: VariableFlowProps["setVarFlowHighlightState"];
  statementColorsState: StatementColorPickerProps["statementColorsState"];
  setStatementColorsState: StatementColorPickerProps["setStatementColorsState"];
};

const { Text } = Typography;
const { Panel: CollapsePanel } = Collapse;

export const Panel: React.FC<PanelProps> = (props) => {
  const {
    themeState,
    setThemeState,
    functionsState,
    setFunctionsState,
    setCodeState,
    filterState,
    setFilterState,
    fontSizeRange,
    fontSizeState,
    setFontSizeState,
    arrowColorState,
    setArrowColorState,
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
        title: "Source Code Upload",
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
          selectCallback={(_function, key) => {
            setCodeState(_function);
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
            themeState,
            setThemeState,
            fontSizeRange,
            fontSizeState,
            setFontSizeState,
            lineHeightRange,
            lineHeightState,
            setLineHeightState,
          }}
        />
      ),
    },
    {
      header: {
        icon: <IconFont type="icon-color" />,
        title: "Statement Color",
      },
      content: (
        <StatementColorPicker
          {...{ statementColorsState, setStatementColorsState }}
        />
      ),
      props: {
        extra: importExport(statementColorsState, setStatementColorsState),
      },
    },
    {
      header: {
        icon: <IconFont type="icon-curve-" />,
        title: "Variable Flow",
      },
      content: (
        <VariableFlow
          {...{
            arrowColorState,
            setArrowColorState,
            varFlowEnableState,
            setVarFlowEnableState,
            heatMapEnableState,
            setHeatMapEnableState,
            varFlowHighlightState,
            setVarFlowHighlightState,
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
