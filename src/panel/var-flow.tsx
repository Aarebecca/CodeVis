import React, { useState } from "react";
import { GithubPicker } from "react-color";
import { Form, Switch, Tooltip } from "antd";

import type { SetState } from "../types";

export type VariableFlowProps = {
  arrowColorState: string;
  setArrowColorState: SetState<string>;
  varFlowEnableState: boolean;
  setVarFlowEnableState: SetState<boolean>;
  varFlowHighlightState: boolean;
  setVarFlowHighlightState: SetState<boolean>;
  heatMapEnableState: boolean;
  setHeatMapEnableState: SetState<boolean>;
};

const { Item } = Form;

export const VariableFlow: React.FC<VariableFlowProps> = (props) => {
  const {
    arrowColorState,
    setArrowColorState,
    varFlowEnableState,
    setVarFlowEnableState,
    varFlowHighlightState,
    setVarFlowHighlightState,
    heatMapEnableState,
    setHeatMapEnableState,
  } = props;

  const [showColorPickerState, setShowColorPickerState] =
    useState<boolean>(false);

  window.onclick = (e: MouseEvent) => {
    // @ts-ignore
    if (e.target?.id !== "arrow-color") {
      setShowColorPickerState(false);
    }
  };

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
      <Item
        label={
          <Tooltip title="Enable variable flow" placement="topLeft">
            {"Flow"}
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
          <Tooltip title="Enable variable flow" placement="topLeft">
            {"Heat Map"}
          </Tooltip>
        }
      >
        <Switch
          defaultChecked={heatMapEnableState}
          onClick={(checked) => {
            setHeatMapEnableState(checked);
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
      <Item
        label={
          <Tooltip title="Arrow Color" placement="topLeft">
            {"Arrow Color"}
          </Tooltip>
        }
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: arrowColorState,
            border: "2px solid lightgray",
          }}
          id="arrow-color"
          onClick={(e) => {
            setShowColorPickerState(!showColorPickerState);
          }}
        ></div>
        {showColorPickerState ? (
          <div
            style={{
              zIndex: 10,
              left: "-8px",
              top: "32px",
              position: "absolute",
            }}
          >
            <GithubPicker
              color={arrowColorState}
              onChangeComplete={(color) => {
                setArrowColorState(color.hex);
              }}
            />
          </div>
        ) : (
          ""
        )}
      </Item>
    </Form>
  );
};
