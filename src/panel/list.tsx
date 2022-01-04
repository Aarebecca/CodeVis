import React, { useState } from "react";
import { Popover, Switch, Table, Tooltip, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import type { ListProps } from "./type";

const { Text } = Typography;

export const PanelList: React.FC<ListProps> = (props) => {
  const { data, selectCallback } = props;
  const [selectionState, setSelectionState] = useState<
    {
      key: string;
      text: React.ReactNode;
    }[]
  >([]);

  const columns = [
    {
      title: "Function",
      dataIndex: "_function",
      ellipsis: {
        showTitle: false,
      },
      render: (f: string) => (
        <Tooltip placement="topLeft" title={f}>
          {f}
        </Tooltip>
      ),
    },
  ];

  const onSelectionChanged = (record: { key: string; _function: string }) => {
    selectCallback && selectCallback(record._function, record.key);
  };

  return (
    <Table
      dataSource={data?.map((item, idx) => {
        return {
          key: String(idx),
          _function: item,
        };
      })}
      columns={columns}
      rowSelection={{
        type: "radio",
        onSelect: onSelectionChanged,
        selections: selectionState,
      }}
    />
  );
};

export const CollapseFilter = (
  filterState: boolean,
  setFilterState: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const onFilterChange = (checked: boolean, event: MouseEvent) => {
    event.stopPropagation();
    setFilterState(checked);
  };

  return (
    <Popover
      placement="top"
      content={
        <>
          <Text> Filter: </Text>
          <Switch checked={filterState} onChange={onFilterChange} />
        </>
      }
    >
      <SettingOutlined
        onClick={(event) => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
        }}
      />
    </Popover>
  );
};
