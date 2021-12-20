import { editor } from "monaco-editor/esm/vs/editor/editor.api";
export type { Monaco } from "@monaco-editor/react";

export const EditorOption = editor.EditorOption;

export type EEditorOption = editor.EditorOption;
export type FontInfo = editor.FontInfo;
export type ICodeEditor = editor.ICodeEditor;
export type Decoration = {
  range: [number, number, number, number];
  className: string;
  type?: "" | "glyphMargin" | "inline" | "lineDecorations" | "margin";
};

export interface EditorOptions {
  code: string;
  lineHeight?: number;
  fontSize?: number;
  theme?: "light" | "vs-dark";
  decorations?: Decoration[];
}
