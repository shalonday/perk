import styles from "./Search.module.css";
import { Link } from "react-router-dom";
import D3Chart from "../components/D3Chart";
import { useSkillTreesContext } from "../contexts/SkillTreesContext";
import { useState } from "react";

function Search() {
  const { universalTree, isLoading, setElementsToEdit } =
    useSkillTreesContext();
  const [isNodeDescriptionVisible, setIsNodeDescriptionVisible] =
    useState(false);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  let timer;
  const touchduration = 500;

  function handleNodeClick(e) {
    console.log("mouseclick");
    // normal click or normal touch

    if (e.target !== currentNode) setIsNodeDescriptionVisible(true);
    else setIsNodeDescriptionVisible((val) => !val); // if the last node clicked (currentNode) is clicked again, alternate between opening and closing

    // ctrl + click
    if (e.ctrlKey) {
      // allow for multiple selection
      console.log("ctrl click");
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

    setCurrentNode(e.target);
  }

  function handleNodeTouchStart(e) {
    // !!! still need to test on actual phone. do on longtouch
    if (window.matchMedia("(pointer: coarse)").matches) {
      //https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
      // touchscreen
      console.log("touch");
      timer = setTimeout(() => {
        toggleSelect(e.target);
        console.log("longtouch");
      }, touchduration);
    }
  }

  // SVGElement -> Effect
  // Adds or removes target from selectedNodes
  function toggleSelect(target) {
    console.log("toggleSelect");
    if (!selectedNodes.includes(target))
      setSelectedNodes((arr) => [...arr, target]);
    else
      setSelectedNodes((arr) =>
        arr.filter((el) => el.__data__.id !== target.__data__.id)
      );
  }

  function handleNodeTouchEnd() {
    console.log("touchend");
    //stops short touches from firing the event
    if (timer) clearTimeout(timer); // https://stackoverflow.com/questions/6139225/how-to-detect-a-long-touch-pressure-with-javascript-for-android-and-iphone
  }

  function handlePlusClick() {
    setElementsToEdit({ nodes: selectedNodes, links: [] });
  }

  return (
    <div>
      {isLoading ? (
        <h1>Loading</h1>
      ) : (
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
