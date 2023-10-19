import * as d3 from "d3";
import { useEffect, useRef } from "react";

const SVG_WIDTH = 968;
const SVG_HEIGHT = 600;
const ROOT_FX = SVG_WIDTH / 2; // stands for "fixed x coordinate", signifies D3 to fix this node on a point.
const ROOT_FY = (SVG_HEIGHT - 200) / 2; // stands for "fixed y coordinate"

function ForceGraph(data, gLinkRef, gNodeRef) {
  // Specify the dimensions of the chart.
  const width = SVG_WIDTH;
  const height = SVG_HEIGHT;

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = data.links.map((d) => ({ ...d }));
  const nodes = data.nodes.map((d) => ({ ...d }));

  // Create a simulation with several forces.
  d3.forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  const link = d3.select(gLinkRef.current).selectAll("line").data(links);

  const node = d3
    .select(gNodeRef.current)
    .selectAll("circle")
    .data(nodes)
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

export default function D3Chart({ tree, className }) {
  const gLinkRef = useRef();
  const gNodeRef = useRef();
  useEffect(() => {
    if (isTreeRenderable(tree)) {
      ForceGraph(tree, gLinkRef, gNodeRef);

      // if (svgRef.current) {
      //   svgRef.current.appendChild(chart);
      // }
    }
  }, [tree]);

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        style={{ maxWidth: "100%", height: "auto" }}
      >
        <g ref={gLinkRef}>
          {tree.links.map((link) => (
            <line stroke="#4338ca" stroke-width={1.5}></line>
          ))}
        </g>
        <g ref={gNodeRef}>
          {tree.nodes.map((node) => (
            <circle fill="#ec4899" stroke-width={1.5}></circle> //
          ))}
        </g>
      </svg>{" "}
    </div>
  );
}
