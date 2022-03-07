import _ from "lodash";
import React, { useRef, useState, useEffect } from "react";
import { Spin } from "antd";
import Editor from "@monaco-editor/react";

import type { ICodeEditor, Monaco, EditorProps } from "./types";

/**
 * Monaco editor
 * @param props EditorProps
 * @returns Editor
 */
const CodeEditor: React.FC<EditorProps> = (props) => {
  const editorRef = useRef<ICodeEditor | null>(null);
  const [editorState, setEditorState] = useState<ICodeEditor>();
  const [monacoState, setMonacoState] = useState<Monaco>();
  const [decoState, setDecoState] = useState<string[][]>([]);

  const { code, lineHeight, fontSize, theme } = props;

  function handleEditorDidMount(editor: ICodeEditor, monaco: Monaco) {
    editorRef.current = editor;
    setEditorState(editor);
    setMonacoState(monaco);
  }

  /**
   * tell parent component the editor instance
   */
  useEffect(() => {
    if (props.getEditorInstance && editorState && monacoState) {
      props.getEditorInstance({
        editor: editorState,
        monaco: monacoState,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState, monacoState, props.getEditorInstance]);

  /**
   * draw decorations
   */
  useEffect(() => {
    /**
     * 添加编辑器的装饰
     */
    const addDecorations = () => {
      if (!editorState || !monacoState) return;

      const { decorations = [] } = props;
      decorations.forEach(({ range, className, type = "inline" }) => {
        const decoration = editorState.deltaDecorations(
          [],
          [
            {
              range: new monacoState.Range(...range),
              options: {
                [_.camelCase(`${type}ClassName`)]: className,
              },
            },
          ]
        );
        setDecoState((prev) => [...prev, decoration]);
      });
    };

    /**
     * 删除编辑器的装饰
     */
    const removeDecoration = (decoration: string[]) => {
      if (editorState) {
        editorState.deltaDecorations(decoration, []);
        setDecoState((prev) => prev.filter((d) => d !== decoration));
      }
    };

    /**
     * 删除所有编辑器的装饰
     */
    function removeAllDecoration() {
      if (editorState) {
        decoState.forEach((decoration) => {
          removeDecoration(decoration);
        });
        setDecoState([]);
      }
    }

    removeAllDecoration();
    addDecorations();
    return removeAllDecoration;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.decorations, editorState, monacoState, fontSize]);

  useEffect(() => {
    editorState?.getModel()?.setValue(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  /**
   * 编辑器构成
   * 横向：contentLeft行号区(lineNumbersWidth + decorationsWidth) + contentWidth代码区 + minimapWidth(overviewRuler 滑动条)
   * 注意代码区和minimap有重叠
   */
  return (
    <Editor
      defaultLanguage="javascript"
      defaultValue={code}
      theme={theme}
      loading={<Spin tip="Loading..." />}
      options={{
        fontSize,
        lineHeight,
        lineNumbers: "on",
        scrollbar: {
          vertical: "hidden",
          horizontal: "hidden",
        },
      }}
      onMount={handleEditorDidMount}
    />
  );
};

export { CodeEditor };
