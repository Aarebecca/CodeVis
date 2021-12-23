export type AnyObject<T = string> = {
  [keys: string]: T;
};

export type Point = [number, number];

export type Position = Point;

export type VSPoint = {
  line: number;
  column: number;
};
