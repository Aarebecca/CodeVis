import * as d3 from "d3";
import React, { useRef, useEffect } from "react";
import { LifeCycleDiagram } from "./lifecycle";

export type LifeCycleProps = {};

export const LifeCycle: React.FC<LifeCycleProps> = (props) => {
  const lifeCycleRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const lifeCycle = d3.select(lifeCycleRef.current);
    lifeCycle
      .insert("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 500)
      .attr("height", 500)
      .attr("fill", "white")
      .attr("stroke", "red");
  }, [lifeCycleRef]);

  useEffect(() => {
    const lC = new LifeCycleDiagram({
      colorMap: {
        Identifier: "red",
      },
    });

    lC.generate({
      node: { start: 1, end: 5, type: "A" }, // depth 1
      children: [
        {
          node: { start: 2, end: 2, type: "B" }, // depth 2
          children: [],
        },
        {
          node: { start: 2, end: 2, type: "C" }, // depth 2
          children: [],
        },
        {
          node: { start: 3, end: 3, type: "D" }, // depth 2
          children: [],
        },
      ],
    });
  });

  return (
    <>
      <svg
        ref={lifeCycleRef}
        style={{ width: "100%", height: "100%" }}
        className="life-cycle"
      ></svg>
    </>
  );
};
