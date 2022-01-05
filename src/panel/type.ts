import type { FunctionList, SetState, StatementColor } from "../types";

export type PanelUploadProps = {
  onUpload?: (functionList: FunctionList) => void;
};

export type RGBColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type ColorItemsProps = {
  statementColorsState: StatementColor[];
  setStatementColorsState: SetState<StatementColor[]>;
};
