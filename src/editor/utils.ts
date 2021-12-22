import type { ICodeEditor } from "./types";
import type { EEditorOption, FontInfo } from "./types";
import type { Point } from "../types";
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

const biasOptions = [
  "center",
  "leftTop",
  "fontLeftTop",
  "fontTop",
  "fontBottom",
  "fontLeft",
  "fontRight",
] as const;

export type BiasOptions = typeof biasOptions[number];

/**
 * 将代码的行列号转化为其相对于内容区左上角的位置
 * @param bias 偏移。center - 中心位置, leftTop - 左上角, fontLeftTop - 字体左上角
 * @param offset 为避免线条与字体的边界重合，可以设置偏移量
 */
export function lineCol2Position(
  editor: ICodeEditor,
  line: number,
  column: number,
  bias: BiasOptions = "fontLeftTop",
  offset: [number, number] = [5, 0]
): Point {
  const lineHeight = getLineHeight(editor);
  const top = lineHeight * (line - 1);
  const [charWidth, charHeight] = getCharacterShape(editor);
  const left = (column - 1) * charWidth;
  const [offsetX, offsetY] = offset;
  if (bias === "fontLeftTop") {
    return [left - offsetX, top + (lineHeight - charHeight) / 2 - offsetY];
  }
  if (bias === "fontTop") {
    return [
      left + charWidth / 2,
      top + (lineHeight - charHeight) / 2 - offsetY,
    ];
  }
  if (bias === "fontBottom") {
    return [
      left + charWidth / 2,
      top + (lineHeight + charHeight) / 2 + offsetY,
    ];
  }
  if (bias === "fontLeft") {
    return [left - offsetX, top + lineHeight / 2];
  }
  if (bias === "fontRight") {
    return [left + charWidth + offsetX, top + lineHeight / 2];
  }
  // center
  return [left + charWidth / 2, top + lineHeight / 2];
}
