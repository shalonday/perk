import * as d3 from "d3";
import { useEffect, useRef } from "react";

const SVG_WIDTH = 968;
const SVG_HEIGHT = 600;
const ROOT_FX = SVG_WIDTH / 2; // stands for "fixed x coordinate", signifies D3 to fix this node on a point.
const ROOT_FY = (SVG_HEIGHT - 200) / 2; // stands for "fixed y coordinate"

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

// checks if all source and target nodes in tree.links exist, and if all nodes are linked.
function isTreeRenderable(tree) {
  return (
    tree.nodes.every((node) => isNodeLinked(node, tree.links)) &&
    tree.links.every((link) => isLinkUsingExistingNodes(link, tree.nodes))
  );
}

// check if node is mentioned in any of the sources or targets
function isNodeLinked(node, links) {
  return links
    .map((link) => link.source)
    .concat(links.map((link) => link.target))
    .includes(node.id);
}

function isLinkUsingExistingNodes(link, nodes) {
  return (
    nodes.map((node) => node.id).includes(link.source) &&
    nodes.map((node) => node.id).includes(link.target)
  );
}

export default function D3Chart({ tree }) {
  const ref = useRef();
  useEffect(() => {
    if (isTreeRenderable(tree)) {
      const chart = ForceGraph(tree);

      if (ref.current) {
        ref.current.appendChild(chart);
      }
    }
  }, [tree]);

  return <div ref={ref} />;
}
