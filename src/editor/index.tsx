import React, { useRef, useState, useEffect } from "react";
import { Spin } from "antd";
import Editor from "@monaco-editor/react";
import { getEditorPosition, getLineHeight, measureEditorText } from "./utils";

import type { ICodeEditor, Monaco } from "./types";

export interface EditorOptions {
  code: string;
  lineHeight?: number;
  fontSize?: number;
  theme?: "light" | "vs-dark";
}

/**
 * Monaco editor
 * @param props EditorOptions
 * @returns Editor
 */
const CodeEditor: React.FC<EditorOptions> = (props) => {
  const editorRef = useRef<ICodeEditor | null>(null);
  const [editorState, setEditorState] = useState<ICodeEditor>();
  const [monacoState, setMonacoState] = useState<Monaco>();

  function handleEditorDidMount(editor: ICodeEditor, monaco: Monaco) {
    editorRef.current = editor;
    setEditorState(editor);
    setMonacoState(monaco);

    var decorations = editor.deltaDecorations(
      [],
      [
        {
          range: new monaco.Range(3, 1, 3, 1),
          options: {
            isWholeLine: true,
            className: "rgba-255-0-0-1",
            glyphMarginClassName: "rgba-0-255-0-1",
          },
        },
      ]
    );
  }

  const { code = "", lineHeight = 19, fontSize = 14, theme = "light" } = props;

  /**
   * 编辑器构成
   * 横向：contentLeft行号区(lineNumbersWidth + decorationsWidth) + contentWidth代码区 + minimapWidth(overviewRuler 滑动条)
   * 注意代码区和minimap有重叠
   */
  return (
    <Editor
      defaultLanguage="javascript"
      defaultValue={code}
      path="avb.js"
      theme={theme}
      loading={<Spin tip="Loading..." />}
      options={{
        lineNumbers: "on",
        lineHeight,
        fontSize,
        glyphMargin: true,
      }}
      onMount={handleEditorDidMount}
    />
  );
};

export { CodeEditor };
