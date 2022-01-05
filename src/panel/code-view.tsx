import React from "react";
import { Col, Form, InputNumber, Row, Slider, Switch, Tooltip } from "antd";

import type { SetState } from "../types";

export type SliderInputNumberProps = {
  range: [number, number];
  lineHeightState: number;
  setLineHeightState: SetState<number>;
};
export type PanelEditorConfigProps = {
  lineHeightRange: [number, number];
  lineHeightState: SliderInputNumberProps["lineHeightState"];
  setLineHeightState: SliderInputNumberProps["setLineHeightState"];
};

const { Item } = Form;

const SliderInputNumber = (props: SliderInputNumberProps) => {
  const {
    range: [min, max],
    lineHeightState: value,
    setLineHeightState: setValue,
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
        <Item label="Line Height">
          <SliderInputNumber
            {...{ range: lineHeightRange, lineHeightState, setLineHeightState }}
          />
        </Item>
      </Form>
    </>
  );
};
