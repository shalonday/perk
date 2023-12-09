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
    <>
      <D3Chart
        tree={branch}
        className={styles.svgContainer}
        onNodeClick={handleNodeClick}
        onNodeDblClick={handleNodeDblClick}
        selectedNodeIds={[clickedNode?.id]}
      />
    </>
  );
}

export default TreePageChart;
