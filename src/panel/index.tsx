import React, { useState } from "react";
import { Collapse, Typography } from "antd";
import { PanelUpload } from "./upload";
import { PanelList, CollapseFilter } from "./list";
import { PanelConfig } from "./configuration";

import {
  AppstoreOutlined,
  CaretRightOutlined,
  CloudUploadOutlined,
  EditOutlined,
  FileTextOutlined,
  SyncOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import type { CollapseProps } from "antd";
import type { FunctionList } from "../types";
import type { PanelProps } from "./type";

const { Text } = Typography;
const { Panel: CollapsePanel } = Collapse;

export const Panel: React.FC<PanelProps> = (props) => {
  const [functionListState, setFunctionListState] = useState<FunctionList>();
  const [filterState, setFilterState] = useState<boolean>(false);

  const expandIcon: CollapseProps["expandIcon"] = ({ isActive }) => (
    <CaretRightOutlined rotate={isActive ? 90 : 0} />
  );

  return (
    <Collapse expandIcon={expandIcon}>
      <CollapsePanel
        header={
          <Text>
            <CloudUploadOutlined />
            {" Upload"}
          </Text>
        }
        key="1"
        showArrow={false}
      >
        <PanelUpload
          onUpload={(functionList) => {
            setFunctionListState(functionList);
          }}
        />
      </CollapsePanel>
      <CollapsePanel
        header={
          <Text>
            <UnorderedListOutlined />
            {" Function List"}
          </Text>
        }
        key="2"
        showArrow={false}
        extra={CollapseFilter(filterState, setFilterState)}
      >
        <PanelList
          data={functionListState?.[filterState ? "available" : "functions"]}
        />
      </CollapsePanel>
      <CollapsePanel
        header={
          <Text>
            <FileTextOutlined />
            {" Configuration"}
          </Text>
        }
        key="3"
        showArrow={false}
      >
        <PanelConfig />
      </CollapsePanel>
      <CollapsePanel
        header={
          <Text>
            <SyncOutlined />
            {" Life Cycle"}
          </Text>
        }
        key="4"
        showArrow={false}
      >
        CollapsePanel
      </CollapsePanel>
      <CollapsePanel
        header={
          <Text>
            <AppstoreOutlined />
            {" Phenogram"}
          </Text>
        }
        key="5"
        showArrow={false}
      >
        CollapsePanel
      </CollapsePanel>
      <CollapsePanel
        header={
          <Text>
            <EditOutlined />
            {" Conclusion"}
          </Text>
        }
        key="6"
        showArrow={false}
      >
        CollapsePanel
      </CollapsePanel>
    </Collapse>
  );
};
