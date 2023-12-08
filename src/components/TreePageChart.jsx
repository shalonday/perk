import D3Chart from "./D3Chart";
import styles from "./TreePageChart.module.css";

function TreePageChart({ branch, clickedNode, setClickedNode }) {
  function handleNodeClick(e) {
    setClickedNode((clickedNode) =>
      clickedNode === e.target ? null : e.target
    );
  }

  function handleNodeDblClick(e) {
    // if module, enter module view.
  }

  return (
    <div>
      <D3Chart
        tree={branch}
        className={styles.svgContainer}
        onNodeClick={handleNodeClick}
        onNodeDblClick={handleNodeDblClick}
        selectedNodeIds={[clickedNode.id]}
      />
    </div>
  );
}

export default TreePageChart;
