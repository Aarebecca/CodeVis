import * as d3 from "d3";
import type { D3Selection, RenderData } from "./types";

/**
 *
 * @param container d3 selection
 * @param data render data
 * @param size size of svg
 * @param shape shape of matrix
 * @param margin margin between rects
 */
export function chart(
  container: D3Selection,
  data: RenderData,
  size: [number, number],
  shape: [number, number],
  margin: number = 0
) {
  // 格子大小
  const width = (size[0] - (shape[0] - 1) * margin) / shape[0];
  const height = (size[1] - (shape[1] - 1) * margin) / shape[1];

  const stepX = size[0] / shape[0];
  const stepY = size[1] / shape[1];

  const g = container
    .selectAll(".phenogram-chart-element")
    .append("g")
    .attr("class", "phenogram-chart-element");
  g.selectAll(".phenogram-chart-element-rect")
    .data(data)
    .join("rect")
    .attr("class", "phenogram-chart-element-rect")
    .attr("x", ({ column }) => column * stepX)
    .attr("y", ({ line }) => line * stepY)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", ({ color }) => color)
    .on("click", function () {
      console.log(d3.select(this).data);
    });
}
