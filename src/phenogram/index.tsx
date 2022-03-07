import React, { useRef } from "react";
import { PhenogramProps } from "./types";

/**
 * 这个视图的逻辑应当是，输入一段代码，给出该代码的表征图，以及一些相似的代码
 */
export const Phenogram: React.FC<PhenogramProps> = (props) => {
  const phenogramRef = useRef<SVGSVGElement>(null);

  const { code } = props;

  /**
   * 1. 查询代码相似代码
   * 2. 返回数据绘制
   */

  return (
    <>
      <svg
        ref={phenogramRef}
        style={{ width: "100%", height: "100%" }}
        className="phenogram"
      ></svg>
    </>
  );
};
