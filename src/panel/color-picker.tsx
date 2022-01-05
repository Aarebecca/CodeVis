import React, { useState, useMemo } from "react";
import { Col, Modal, Row, Select, Tag } from "antd";
import { CompactPicker } from "react-color";
import Color from "color";
import STATEMENT from "../config/statement.json";

import { PlusOutlined } from "@ant-design/icons";

import type { RGBColor, ColorItemsProps } from "./type";

const { Option } = Select;

export const ColorItems: React.FC<ColorItemsProps> = (props) => {
  const { statementColorsState, setStatementColorsState } = props;

  const [showColorPickerState, setShowColorPickerState] =
    useState<boolean>(false);
  const [statementState, setStatementState] = useState<string | undefined>();
  const [modeState, setModeState] = useState<"add" | "edit">("add");
  const initColor = {
    r: 255,
    g: 255,
    b: 255,
  };
  const [chooseColorState, setChooseColorState] = useState<RGBColor>(initColor);

  const modifiedColor = (color: RGBColor) => {
    const { r, g, b, a } = color;
    const colorStr = a
      ? `rgba(${r}, ${g}, ${b}, ${a})`
      : `rgb(${r}, ${g}, ${b})`;
    if (modeState === "add") {
      addStatementColor(statementState!, colorStr);
    } else {
      editStatementColor(statementState!, colorStr);
    }
  };

  const addStatementColor = (statement: string, color: string) => {
    setStatementColorsState([...statementColorsState, { statement, color }]);
  };

  const editStatementColor = (statement: string, color: string) => {
    const newStatementColors = statementColorsState.map((item) => {
      if (item.statement === statement) {
        return {
          ...item,
          color,
        };
      }
      return item;
    });
    setStatementColorsState(newStatementColors);
  };

  const removeStatementColor = (statement: string) => {
    const newStatementColors = statementColorsState.filter(
      (item) => item.statement !== statement
    );
    setStatementColorsState(newStatementColors);
  };

  const onEditTag = (statement: string, color: string) => {
    setChooseColorState(Color(color).object() as RGBColor);
    setStatementState(statement);
    showEditModal();
  };

  const showAddModal = () => {
    setModeState("add");
    setStatementState(statementUnused[0]);
    setShowColorPickerState(true);
  };

  const showEditModal = () => {
    setModeState("edit");
    setShowColorPickerState(true);
  };

  const reset = () => {
    setStatementState(undefined);
    setChooseColorState(initColor);
    setShowColorPickerState(false);
  };

  const handleOk = () => {
    modifiedColor(chooseColorState);
    reset();
  };

  const handleCancel = () => {
    reset();
  };

  const statementUnused = useMemo(() => {
    const currList = statementColorsState.map((item) => item.statement);
    return STATEMENT.filter((statement) => !currList.includes(statement));
  }, [statementColorsState]);

  const addSelection = () => {
    // omit the statement that is already in the list
    return (
      <Select
        showSearch
        defaultValue={statementUnused[0]}
        onChange={(statement: string) => {
          setStatementState(statement);
        }}
        optionFilterProp="children"
        filterOption={(input: string, option: any) => {
          return (
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          );
        }}
        style={{ width: 200 }}
      >
        {statementUnused.map((statement) => (
          <Option value={statement} key={statement}>
            {statement}
          </Option>
        ))}
      </Select>
    );
  };

  const editSelection = () => {
    return (
      <Select defaultValue={statementState} style={{ width: 200 }} disabled>
        <Option value={statementState} key={statementState}>
          {statementState}
        </Option>
      </Select>
    );
  };

  return (
    <div>
      {statementColorsState.map(({ statement, color }) => {
        return (
          <Tag
            closable
            key={statement}
            color={color}
            onClick={() => onEditTag(statement, color)}
            onClose={(e) => {
              e.preventDefault();
              removeStatementColor(statement);
            }}
            style={{ margin: "1px 2px 1px 0px" }}
          >
            {statement}
          </Tag>
        );
      })}
      <Tag onClick={showAddModal}>
        <PlusOutlined /> Add Statement
      </Tag>
      {showColorPickerState ? (
        <Modal
          title={"Statement Color"}
          onOk={handleOk}
          onCancel={handleCancel}
          visible={showColorPickerState}
        >
          <Row>
            <Col span={8}>
              {modeState === "add" ? addSelection() : editSelection()}
            </Col>
            <Col span={16} style={{ textAlign: "right" }}>
              <CompactPicker
                onChangeComplete={(color) => {
                  setChooseColorState(color.rgb);
                }}
              />
            </Col>
          </Row>
        </Modal>
      ) : null}
    </div>
  );
};
