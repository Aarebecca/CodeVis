import * as d3 from "d3";
import React, { useRef, useEffect } from "react";
import "./style.less";

export interface IVarFlow {
  data?: any;
  lineHeight?: number;
}

const VarFlow: React.FC<IVarFlow> = (props) => {
  const varFlowRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(varFlowRef.current);
  });

  return <svg ref={varFlowRef} className="var-flow-graph" />;
};

export { VarFlow };
