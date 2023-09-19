// Produces an image that represents a Skill Tree. A later feature should be that this visual
// representation should be traversable--like when using Google Earth--and users can click on
// nodes and paths to view their details.
// see https://konvajs.org/docs/react/index.html for Konva React documentation
import { Stage, Layer, Circle, Line } from "react-konva";

const NODE_RADIUS = 30;
const X_AXIS_OFFSET = 100; // distance of the center of leftmost node from the left edge of the canvas
const X_AXIS_SEPARATOR = 100; // number of pixels separating node centers along the x-axis. multiplied by node index

function KonvaCanvas({ pathsArray, nodesArray }) {
  return (
    <Stage width={window.innerWidth / 2} height={window.innerHeight}>
      <Layer>
        {nodesArray.map((node, index) => (
          <Circle
            x={X_AXIS_OFFSET + X_AXIS_SEPARATOR * index}
            y={window.innerHeight / 2}
            radius={NODE_RADIUS}
            fill="green"
            key={index}
          />
        ))}

        {pathsArray.map((path, index) => (
          <Line
            points={[
              NODE_RADIUS + (X_AXIS_OFFSET + X_AXIS_SEPARATOR * index),
              window.innerHeight / 2,
              -1 * NODE_RADIUS +
                (X_AXIS_OFFSET + X_AXIS_SEPARATOR * (index + 1)),
              window.innerHeight / 2,
            ]}
            tension={0.5}
            closed
            stroke="black"
            key={index}
          />
        ))}
      </Layer>
    </Stage>
  );
}

export default KonvaCanvas;
