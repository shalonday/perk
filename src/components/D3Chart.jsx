import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { SVG_HEIGHT, SVG_WIDTH } from "../utils";

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

// Checks if either the tree consists of only one node and no paths, or if
// all source and target nodes in tree.links exist, and if all nodes are linked.
// These are the conditions to say that a tree is renderable.
function isTreeRenderable(tree) {
  return (
    (tree.nodes.length === 1 && tree.links.length === 0) ||
    (tree.nodes.every((node) => isNodeLinked(node, tree.links)) &&
      tree.links.every((link) => isLinkUsingExistingNodes(link, tree.nodes)))
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
            <marker
              key={"m" + link.id}
              id="arrow"
              viewBox="0 0 10 10"
              refX="15"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
              fill="#4338ca"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          ))}

          {tree.links.map((link) => (
            <line
              key={link.id}
              stroke="#4338ca"
              strokeWidth={1.5}
              markerEnd="url(#arrow)"
            ></line>
          ))}
        </g>
        <g ref={gNodeRef}>
          {tree.nodes.map((node) => (
            <circle key={node.id} fill="#ec4899" strokeWidth={1.5}></circle> //
          ))}
        </g>
      </svg>{" "}
    </div>
  );
}
