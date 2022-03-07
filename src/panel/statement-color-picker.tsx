import React from "react";
import { Tooltip } from "antd";
import { ColorItems } from "./color-picker";
import { ImportOutlined, DeliveredProcedureOutlined } from "@ant-design/icons";

import type { SetState, StatementColor } from "../types";

export type StatementColorPickerProps = {
  statementColorsState: StatementColor[];
  setStatementColorsState: SetState<StatementColor[]>;
};

const importCfg = (setState: SetState<StatementColor[]>) => {
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
      setState(loadedStatementColors);
    };
    reader.readAsText(file);
  };
  input.click();
};

const exportCfg = (state: StatementColor[]) => {
  const output = document.createElement("a");
  output.href = `data:text/plain;charset=utf-8,${encodeURIComponent(
    JSON.stringify(state)
  )}`;
  output.download = "statement-colors.json";
  output.click();
};

export const importExport = (
  state: StatementColor[],
  setState: SetState<StatementColor[]>
) => {
  return (
    <>
      <Tooltip title="Import">
        <ImportOutlined
          onClick={(event) => {
            importCfg(setState);
            event.stopPropagation();
          }}
        />
      </Tooltip>{" "}
      <Tooltip title="Export">
        <DeliveredProcedureOutlined
          onClick={(event) => {
            exportCfg(state);
            event.stopPropagation();
          }}
        />
      </Tooltip>
    </>
  );
};

export const StatementColorPicker: React.FC<StatementColorPickerProps> = (
  props
) => {
  const { statementColorsState, setStatementColorsState } = props;

  return (
    <ColorItems
      statementColorsState={statementColorsState}
      setStatementColorsState={setStatementColorsState}
    />
  );
};
