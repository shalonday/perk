import { useEffect, useRef, useState } from "react";
import { useSkillTreesContext } from "../contexts/SkillTreesContext";
import D3Chart from "./D3Chart";
import styles from "./SearchPageChart.module.css";

function SearchPageChart({ selectedNodes, setSelectedNodes, setCurrentNode }) {
  const { universalTree, searchResult, pathResult } = useSkillTreesContext();
  const [displayedTree, setDisplayedTree] = useState(universalTree);
  let timer;
  const touchduration = 500;

  const selectedNodeIds = useRef();
  selectedNodeIds.current = selectedNodes.map((node) => node.id);

  useEffect(
    function changeDisplayedTree() {
      Object.keys(searchResult).length === 0 &&
        Object.keys(pathResult).length === 0 &&
        setDisplayedTree(universalTree);

      Object.keys(searchResult).length > 0 &&
        Object.keys(pathResult).length === 0 &&
        setDisplayedTree(searchResult);

      Object.keys(searchResult).length === 0 &&
        Object.keys(pathResult).length > 0 &&
        setDisplayedTree(pathResult);

      if (
        Object.keys(searchResult).length > 0 &&
        Object.keys(pathResult).length > 0
      )
        console.err(
          "both pathResult and searchResult are non-null. There is a bug"
        );
    },
    [universalTree, searchResult, pathResult]
  );

  // click uses "e.target.__data__" while touch uses "e.subject"; this is because of how the click events are handled at D3Chart.jsx
  function handleNodeClick(e) {
    // ctrl + click
    if (e.ctrlKey) {
      // allow for multiple selection
      toggleSelect(e.target.__data__);
    }
    // select only one node at a time if normal clicking / normal touching
    else if (selectedNodes.length === 0) {
      toggleSelect(e.target.__data__);
    } else if (selectedNodes.length === 1) {
      if (e.target.__data__ === selectedNodes[0])
        toggleSelect(e.target.__data__);
      else {
        setSelectedNodes([]);
        toggleSelect(e.target.__data__);
      }
    } else if (selectedNodes.length > 1) {
      setSelectedNodes([e.target.__data__]);
    }
  }

  function handleNodeTouchStart(e) {
    // !!! still need to test on actual phone.
    //do on longtouch
    if (window.matchMedia("(pointer: coarse)").matches) {
      //https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
      // touchscreen
      timer = setTimeout(() => {
        toggleSelect(e.subject); //
      }, touchduration);
    }
  }

  // SVGElement -> Effect
  // Adds or removes target from selectedNodes
  function toggleSelect(target) {
    if (!selectedNodeIds.current.includes(target.id)) {
      setCurrentNode(target);
      setSelectedNodes((arr) => [...arr, target]);
    } else {
      setSelectedNodes((arr) => arr.filter((el) => el.id !== target.id));
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
        tree={displayedTree}
        onNodeClick={handleNodeClick}
        onNodeTouchStart={handleNodeTouchStart}
        onNodeTouchEnd={handleNodeTouchEnd}
        className={styles.svgContainer}
        selectedNodeIds={selectedNodeIds.current}
      />
    </>
  );
}

export default SearchPageChart;
