import * as d3 from "d3";
import styles from "./D3Chart.module.css";
import { useEffect, useRef } from "react";

const RADIUS = 7;
const SKILL_FILL = "hsl(60 100% 50%)";
const MODULE_FILL = "hsl(60 10% 80%)";
const LINK_COLOR = "hsl(60 10% 80%)";

function ForceGraph(
  data,
  gLinkRef,
  gNodeRef,
  viewBoxWidth = 400,
  viewBoxHeight = 400
) {
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
    .force("x", d3.forceX(viewBoxWidth / 2))
    .force("y", d3.forceY(viewBoxHeight / 2))
    .on("tick", ticked);

  const link = d3.select(gLinkRef.current).selectAll("line").data(links);

  const node = d3
    .select(gNodeRef.current)
    .selectAll("circle")
    .data(nodes)
    .attr("id", (d) => d.id)
    .attr("fill", (d) => {
      if (d.type === "module") return MODULE_FILL;
      else return SKILL_FILL;
    })
    .attr("r", (d) => {
      if (d.type === "module") return RADIUS / 2;
      else return RADIUS;
    });

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
  const svgContainerRef = useRef();
  const viewBoxWidth = svgContainerRef.current?.clientWidth;
  const viewBoxHeight = svgContainerRef.current?.clientHeight;

  useEffect(() => {
    ForceGraph(tree, gLinkRef, gNodeRef, viewBoxWidth, viewBoxHeight);
  }, [tree, viewBoxWidth, viewBoxHeight]);
  return (
    <div className={className} ref={svgContainerRef}>
      <svg
        viewBox={`0 0 ${svgContainerRef.current ? viewBoxWidth : "400"} ${
          svgContainerRef.current ? viewBoxHeight : "400"
        }`}
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
              fill={LINK_COLOR}
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          ))}

          {tree.links.map((link) => (
            <line
              key={link.id}
              stroke={LINK_COLOR}
              strokeWidth={1.5}
              markerEnd="url(#arrow)"
            ></line>
          ))}
        </g>
        <g ref={gNodeRef}>
          {tree.nodes.map((node) => (
            <circle
              key={node.id}
              strokeWidth={1.5}
              onClick={onNodeClick}
              onTouchStart={onNodeTouchStart}
              onTouchEnd={onNodeTouchEnd}
              className={
                selectedNodeIds.includes(node.id)
                  ? styles.selected
                  : `${selectedNodeIds.includes(node.id)}`
              }
            ></circle>
          ))}
        </g>
      </svg>{" "}
    </div>
  );
}
