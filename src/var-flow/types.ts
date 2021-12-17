import { SourceLocation } from "@babel/types";

export type CodeColor = {
  type: string;
  color: string;
  loc: SourceLocation;
};
