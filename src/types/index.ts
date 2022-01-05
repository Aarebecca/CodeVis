export type AnyObject<T = string> = {
  [keys: string]: T;
};

export type Point = [number, number];

export type Position = Point;

export type VSPoint = {
  line: number;
  column: number;
};

export type FunctionList = {
  available: string[];
  functions: string[];
  normalized: string[];
};

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type StatementColor = {
  statement: string;
  color: string;
};
