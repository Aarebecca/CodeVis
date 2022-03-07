import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import type React from "react";
import type { Monaco } from "@monaco-editor/react";

export { Monaco };
export const EditorOption = editor.EditorOption;

export type EEditorOption = editor.EditorOption;
export type FontInfo = editor.FontInfo;
export type ICodeEditor = editor.ICodeEditor;
export type Decoration = {
  range: [number, number, number, number];
  className: string;
  type?: "" | "glyphMargin" | "inline" | "lineDecorations" | "margin";
};

export type CodeEditorInstance = {
  editor: ICodeEditor;
  monaco: Monaco;
};

export interface EditorProps {
  code: string;
  lineHeight?: number;
  fontSize?: number;
  theme: "light" | "vs-dark";
  decorations?: Decoration[];
  getEditorInstance?: React.Dispatch<
    React.SetStateAction<CodeEditorInstance | undefined>
  >;
}
