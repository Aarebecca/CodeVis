import type { StatementColor, AnyObject as ColorMap } from "../types";

export function statementColors2ColorMap(colors: StatementColor[]): ColorMap {
  const _map: ColorMap = {};
  colors.forEach(({ statement, color }) => {
    _map[statement] = color;
  });
  return _map;
}

export function colorMap2StatementColors(_map: ColorMap): StatementColor[] {
  const colors: StatementColor[] = [];
  for (const statement in _map) {
    colors.push({ statement, color: _map[statement] });
  }
  return colors;
}
