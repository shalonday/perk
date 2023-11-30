import styles from "./Search.module.css";
import { Link } from "react-router-dom";
import D3Chart from "../components/D3Chart";
import { useSkillTreesContext } from "../contexts/SkillTreesContext";
import { useState } from "react";

function Search() {
  const { universalTree, isLoading, setElementsToEdit, error } =
    useSkillTreesContext();
  const [isNodeDescriptionVisible, setIsNodeDescriptionVisible] =
    useState(false);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
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
      setIsNodeDescriptionVisible(true);
    } else {
      setSelectedNodes((arr) =>
        arr.filter((el) => el.__data__.id !== target.__data__.id)
      );
      setIsNodeDescriptionVisible(false);
    }
  }

  function handleNodeTouchEnd() {
    //stops short touches from firing the event
    if (timer) clearTimeout(timer); // https://stackoverflow.com/questions/6139225/how-to-detect-a-long-touch-pressure-with-javascript-for-android-and-iphone
  }

  // SVGArray -> RecordArray
  // Extract from the D3 SVGs the database records that were used to make them.
  function getDataObjectsFromD3Node(nodes) {
    return nodes.map((node) => {
      const { vx, vy, x, y, index, ...rest } = node.__data__;
      console.log(rest);
      return rest;
    });
  }

  function handlePlusClick() {
    setElementsToEdit({
      nodes: getDataObjectsFromD3Node(selectedNodes), //this simplifies the rendering at Edit.jsx
      links: [],
    });
  }

  return (
    <div className={styles.searchPage}>
      {isLoading && <h1>Loading</h1>}
      {error && <h1>{error}</h1>}
      {!isLoading && !error && (
        <D3Chart
          tree={universalTree}
          onNodeClick={handleNodeClick}
          onNodeTouchStart={handleNodeTouchStart}
          onNodeTouchEnd={handleNodeTouchEnd}
          className={styles.svgContainer}
          selectedNodeIds={selectedNodes.map((node) => node.id)}
        />
      )}

      <div
        className={styles.nodeDescription}
        style={{ display: isNodeDescriptionVisible ? "block" : "none" }}
      >
        <div>
          <h3>{currentNode?.__data__.title}</h3>
          <h3>
            <Link to={`/edit/`}>
              <button className={styles.createButton} onClick={handlePlusClick}>
                +
              </button>
            </Link>
          </h3>
        </div>
        <p>{currentNode?.__data__.description}</p>
      </div>
    </div>
  );
}

export default Search;
