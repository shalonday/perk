import * as d3 from "d3";
import styles from "./D3Chart.module.css";
import { useEffect, useRef } from "react";
import { SVG_HEIGHT, SVG_WIDTH } from "../utils";

const RADIUS = 10;

function ForceGraph(data, gLinkRef, gNodeRef) {
  // Specify the dimensions of the chart.

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
    .force("charge", d3.forceManyBody().strength(-100))
    .force("x", d3.forceX(SVG_WIDTH / 2))
    .force("y", d3.forceY(SVG_HEIGHT / 2))
    .on("tick", ticked);

  const link = d3.select(gLinkRef.current).selectAll("line").data(links);

  const node = d3
    .select(gNodeRef.current)
    .selectAll("circle")
    .data(nodes)
    .attr("id", (d) => d.id)
    .attr("r", RADIUS);

  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  }
}

export default function D3Chart({
  tree,
  className = "",
  onNodeClick = () => {},
  onNodeTouchStart = () => {},
  onNodeTouchEnd = () => {},
  selectedNodeIds = [],
}) {
  const gLinkRef = useRef();
  const gNodeRef = useRef();
  useEffect(() => {
    ForceGraph(tree, gLinkRef, gNodeRef);
  }, [tree]);
  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        style={{ width: "100%", height: "100%" }}
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
            <circle
              key={node.id}
              fill="#ec4899"
              strokeWidth={1.5}
              onClick={onNodeClick}
              onTouchStart={onNodeTouchStart}
              onTouchEnd={onNodeTouchEnd}
              className={
                selectedNodeIds.includes(node.id)
                  ? styles.selected
                  : `${selectedNodeIds.includes(node.id)}`
              }
            ></circle> //
          ))}
        </g>
      </svg>{" "}
    </div>
  );
}
