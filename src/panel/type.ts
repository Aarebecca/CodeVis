import type { FunctionList } from "../types";

export type PanelProps = {};
export type PanelUploadProps = {
  onUpload?: (functionList: FunctionList) => void;
};

export type ListProps = {
  data?: string[];
  selectCallback?: (f: string, key: string) => void;
};

export type PanelConfigProps = {};

export type RGBColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type StatementColor = {
  statement: string;
  color: string;
};

export type ColorItemsProps = {
  statementColorsState: StatementColor[];
  setStatementColorsState: React.Dispatch<
    React.SetStateAction<StatementColor[]>
  >;
};
