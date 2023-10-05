import * as d3 from "d3";
import { useEffect, useRef } from "react";

const SVG_WIDTH = 968;
const SVG_HEIGHT = 600;
const tempEdgesList = [
  { source: 0, target: 1, value: 1 },
  { source: 1, target: 2, value: 1 },
  { source: 1, target: 3, value: 1 },
  { source: 1, target: 4, value: 1 },
  { source: 2, target: 5, value: 1 },
  { source: 3, target: 5, value: 1 },
  { source: 4, target: 5, value: 1 },
];

const tempNodesList = [
  { id: 0, fx: SVG_WIDTH / 2, fy: (SVG_HEIGHT - 200) / 2 }, // fx and fy are fixed coordinates that the force sim won't touch
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
];

const tree = {
  nodes: tempNodesList,
  links: tempEdgesList,
};

function ForceGraph(data) {
  // Specify the dimensions of the chart.
  const width = SVG_WIDTH;
  const height = SVG_HEIGHT;

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = data.links.map((d) => ({ ...d }));
  const nodes = data.nodes.map((d) => ({ ...d }));

  // Create the SVG container.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Create a simulation with several forces.
  d3.forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  const link = svg
    .append("g")
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .selectAll("line")
    .data(links)
    .enter()
    .append("line");

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("id", (d) => d.id)
    .attr("r", 4.5);

  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  }

  return svg.node();
}

export default function D3Chart() {
  const ref = useRef();
  useEffect(() => {
    const chart = ForceGraph(tree);

    if (ref.current) {
      ref.current.appendChild(chart);
    }
  }, []);

  return <div ref={ref} />;
}
