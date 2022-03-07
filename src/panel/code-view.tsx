import React from "react";
import { Col, Form, InputNumber, Row, Slider, Select, Tooltip } from "antd";

import type { SetState } from "../types";
import type { EditorProps } from "../editor/types";

export type SliderInputNumberProps = {
  range: [number, number];
  value: number;
  setValue: SetState<number>;
};
export type PanelEditorConfigProps = {
  themeState: EditorProps["theme"];
  setThemeState: SetState<EditorProps["theme"]>;
  fontSizeState: number;
  fontSizeRange: [number, number];
  setFontSizeState: SetState<number>;
  lineHeightRange: [number, number];
  lineHeightState: number;
  setLineHeightState: SetState<number>;
};

const { Item } = Form;

const { Option } = Select;

const SliderInputNumber = (props: SliderInputNumberProps) => {
  const {
    range: [min, max],
    value,
    setValue,
  } = props;

  const onChange = (value: number) => {
    setValue(value);
  };

  return (
    <Row>
      <Col span={10}>
        <Slider min={min} max={max} onChange={onChange} value={value} />
      </Col>
      <Col span={2}>
        <InputNumber
          min={min}
          max={max}
          style={{ margin: "0 16px" }}
          value={value}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

export const PanelEditorConfig: React.FC<PanelEditorConfigProps> = (props) => {
  const {
    themeState,
    setThemeState,
    fontSizeState,
    fontSizeRange,
    setFontSizeState,
    lineHeightRange,
    lineHeightState,
    setLineHeightState,
  } = props;
  return (
    <>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Item label="Font Size">
          <SliderInputNumber
            {...{
              range: fontSizeRange,
              value: fontSizeState,
              setValue: setFontSizeState,
            }}
          />
        </Item>
        <Item label="Line Height">
          <SliderInputNumber
            {...{
              range: lineHeightRange,
              value: lineHeightState,
              setValue: setLineHeightState,
            }}
          />
        </Item>
        <Item
          label={
            <Tooltip title="Theme of the code editor" placement="topLeft">
              {"Theme"}
            </Tooltip>
          }
        >
          <Select
            defaultValue={themeState}
            onChange={(val) => {
              setThemeState(val);
            }}
          >
            <Option key={"light"} value="light">
              Light
            </Option>
            <Option key={"dark"} value="vs-dark">Dark</Option>
          </Select>
        </Item>
      </Form>
    </>
  );
};
