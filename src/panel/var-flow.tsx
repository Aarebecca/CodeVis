import React from "react";
import { Collapse, Form, Switch, Tooltip } from "antd";
import { ColorItems } from "./color-picker";
import { ImportOutlined, DeliveredProcedureOutlined } from "@ant-design/icons";

import type { SetState, StatementColor } from "../types";

export type VariableFlowProps = {
  varFlowEnableState: boolean;
  setVarFlowEnableState: SetState<boolean>;
  varFlowHighlightState: boolean;
  setVarFlowHighlightState: SetState<boolean>;
  statementColorsState: StatementColor[];
  setStatementColorsState: SetState<StatementColor[]>;
};

const { Panel } = Collapse;
const { Item } = Form;

export const VariableFlow: React.FC<VariableFlowProps> = (props) => {
  const {
    varFlowEnableState,
    setVarFlowEnableState,
    varFlowHighlightState,
    setVarFlowHighlightState,
    statementColorsState,
    setStatementColorsState,
  } = props;

  const importCfg = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      // read file
      const reader = new FileReader();
      reader.onload = (loadedFile: any) => {
        const loadedStatementColors = JSON.parse(
          loadedFile.target.result
        ) as StatementColor[];
        setStatementColorsState(loadedStatementColors);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const exportCfg = () => {
    const output = document.createElement("a");
    output.href = `data:text/plain;charset=utf-8,${encodeURIComponent(
      JSON.stringify(statementColorsState)
    )}`;
    output.download = "statement-colors.json";
    output.click();
  };

  const importExport = () => {
    return (
      <>
        <Tooltip title="Import">
          <ImportOutlined
            onClick={(event) => {
              importCfg();
              event.stopPropagation();
            }}
          />
        </Tooltip>{" "}
        <Tooltip title="Export">
          <DeliveredProcedureOutlined
            onClick={(event) => {
              exportCfg();
              event.stopPropagation();
            }}
          />
        </Tooltip>
      </>
    );
  };

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
      <Item
        label={
          <Tooltip title="Enable variable flow" placement="topLeft">
            {"Enable"}
          </Tooltip>
        }
      >
        <Switch
          defaultChecked={varFlowEnableState}
          onClick={(checked) => {
            setVarFlowEnableState(checked);
          }}
        />
      </Item>
      <Item
        label={
          <Tooltip
            title="Highlight relative variable flow and code"
            placement="topLeft"
          >
            {"Highlight"}
          </Tooltip>
        }
      >
        <Switch
          defaultChecked={varFlowHighlightState}
          onClick={(checked) => {
            setVarFlowHighlightState(checked);
          }}
        />
      </Item>
      <Item wrapperCol={{ span: 24 }}>
        <Collapse accordion={true} defaultActiveKey="1">
          <Panel header={"Statement Color"} key={"1"} extra={importExport()}>
            <ColorItems
              statementColorsState={statementColorsState}
              setStatementColorsState={setStatementColorsState}
            />
          </Panel>
        </Collapse>
      </Item>
    </Form>
  );
};
