import type { ICodeEditor } from "./types";
import type { Monaco, EEditorOption, FontInfo } from "./types";
import { EditorOption } from "./types";

/**
 * 获得Option
 */
export function getOption(editor: ICodeEditor, option: EEditorOption) {
  return editor.getOption(option);
}

/**
 * 获得编辑器中的文字样式
 */
export function getFontInfo(editor: ICodeEditor): FontInfo {
  return getOption(editor, EditorOption.fontInfo);
}

/**
 * 获得行高
 */
export function getLineHeight(editor: ICodeEditor): number {
  return getOption(editor, EditorOption.lineHeight);
}

/**
 * 获得编辑器字符宽高
 */
function getCharacterShape(editor: ICodeEditor): [number, number] {
  const span = editor
    .getDomNode()!
    .getElementsByClassName("view-lines")[0]
    .getElementsByTagName("span")[1];
  const { width, height } = span.getBoundingClientRect();
  return [Number((width / span.innerText.length).toFixed(1)), height];
}

/**
 * 测算editor中的文本宽度像素值
 * editor中使用等宽字体，因此文本宽度 = 字符数 * 字符宽度
 */
export function measureEditorText(editor: ICodeEditor, text: string) {
  return getCharacterShape(editor)[0] * text.length;
}

/**
 * 获得编辑器当前的位置信息
 * 包括宽高、x、y坐标
 */
export function getEditorPosition(editor: ICodeEditor) {
  const domNode = editor.getDomNode();
  const { x, y } = domNode!.getBoundingClientRect();
  return { x, y };
}
