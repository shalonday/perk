import { useSkillTreesContext } from "../contexts/SkillTreesContext";
import D3Chart from "./D3Chart";
import styles from "./SearchPageChart.module.css";

function SearchPageChart({ selectedNodes, setSelectedNodes, setCurrentNode }) {
  const { universalTree } = useSkillTreesContext();
  let timer;
  const touchduration = 500;

  function handleNodeClick(e) {
    // ctrl + click
    if (e.ctrlKey) {
      // allow for multiple selection
      toggleSelect(e.target);
    }
    // select only one node at a time if normal clicking / normal touching
    else if (selectedNodes.length === 0) {
      toggleSelect(e.target);
    } else if (selectedNodes.length === 1) {
      if (e.target === selectedNodes[0]) toggleSelect(e.target);
      else {
        setSelectedNodes([]);
        toggleSelect(e.target);
      }
    } else if (selectedNodes.length > 1) {
      setSelectedNodes([e.target]);
    }
  }

  function handleNodeTouchStart(e) {
    // !!! still need to test on actual phone.
    //do on longtouch
    if (window.matchMedia("(pointer: coarse)").matches) {
      //https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
      // touchscreen
      timer = setTimeout(() => {
        toggleSelect(e.target);
      }, touchduration);
    }
  }

  // SVGElement -> Effect
  // Adds or removes target from selectedNodes
  function toggleSelect(target) {
    if (!selectedNodes.includes(target)) {
      setCurrentNode(target);
      setSelectedNodes((arr) => [...arr, target]);
    } else {
      setSelectedNodes((arr) =>
        arr.filter((el) => el.__data__.id !== target.__data__.id)
      );
      setCurrentNode(null);
    }
  }

  function handleNodeTouchEnd() {
    //stops short touches from firing the event
    if (timer) clearTimeout(timer); // https://stackoverflow.com/questions/6139225/how-to-detect-a-long-touch-pressure-with-javascript-for-android-and-iphone
  }

  return (
    <>
      <D3Chart
        tree={universalTree}
        onNodeClick={handleNodeClick}
        onNodeTouchStart={handleNodeTouchStart}
        onNodeTouchEnd={handleNodeTouchEnd}
        className={styles.svgContainer}
        selectedNodeIds={selectedNodes.map((node) => node.id)}
      />
    </>
  );
}

export default SearchPageChart;
