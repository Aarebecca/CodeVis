import React, { useState } from "react";
import { Col, Divider, Form, InputNumber, Row, Slider, Switch } from "antd";
import { ColorItems } from "./color-picker";

import type { PanelConfigProps, StatementColor } from "./type";

const { Item } = Form;

type SliderInputNumberProps = {
  range: [number, number];
  defaultValue?: number;
};

const SliderInputNumber = (props: SliderInputNumberProps) => {
  const [value, setValue] = React.useState(
    props.defaultValue || props.range[0]
  );

  const {
    range: [min, max],
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

export const PanelConfig: React.FC<PanelConfigProps> = (props) => {
  const [statementColorsState, setStatementColorsState] = useState<
    StatementColor[]
  >([]);

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} layout="horizontal">
      <Item label="Formatter">
        <Switch />
      </Item>
      <Item label="Line Height">
        <SliderInputNumber range={[10, 30]} />
      </Item>
      <Divider plain>Var Flow</Divider>
      <Item label="Enable">
        <Switch />
      </Item>
      <Item label="Statement Color">
        <ColorItems
          statementColorsState={statementColorsState}
          setStatementColorsState={setStatementColorsState}
        />
      </Item>
    </Form>
  );
};
