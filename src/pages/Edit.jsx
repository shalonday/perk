import styles from "./Edit.module.css";
import { useState } from "react";
import D3Chart from "../components/D3Chart";
import { useSkillTreesContext } from "../contexts/SkillTreesContext";
import ModuleModal from "../components/ModuleModal";
import { useNavigate } from "react-router-dom";

function Edit() {
  const { elementsToEdit, mergeTree, isLoading, error } =
    useSkillTreesContext();

  const navigate = useNavigate();

  const [currentTree, setCurrentTree] = useState(elementsToEdit);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [isNodeDescriptionVisible, setIsNodeDescriptionVisible] =
    useState(false);
  const [isModuleModalVisible, setIsModuleModalVisible] = useState(false);
  let timer;
  const touchduration = 500;

  function handleNodeClick(e) {
    setCurrentNode(e.target);
    if (e.target.__data__.type === "module") {
      toggleSelectModuleNode(e.target);
    } else if (e.target.__data__.type === "skill") {
      handleSkillNodeClick(e);
    }
  }

  // necessary for handling long touches on touchscreen
  function handleNodeTouchStart(e) {
    if (window.matchMedia("(pointer: coarse)").matches) {
      //https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
      timer = setTimeout(() => {
        setCurrentNode(e.target);
        if (e.target.__data__.type === "skill") toggleSelectSkillNode(e.target);
        else if (e.target.__data__.type === "module")
          toggleSelectModuleNode(e.target);
      }, touchduration);
    }
  }

  function handleNodeTouchEnd() {
    //stops short touches from firing the event
    if (timer) clearTimeout(timer); // https://stackoverflow.com/questions/6139225/how-to-detect-a-long-touch-pressure-with-javascript-for-android-and-iphone
  }

  function handleSkillNodeClick(e) {
    if (e.ctrlKey) {
      // allow for multiple selection
      toggleSelectSkillNode(e.target);
    } else {
      selectOneSkillNodeAtATime(e.target);
    }
  }

  function selectOneSkillNodeAtATime(targetSkillNode) {
    if (selectedNodes.length === 0) {
      toggleSelectSkillNode(targetSkillNode);
    } else if (selectedNodes.length === 1) {
      if (targetSkillNode === selectedNodes[0])
        toggleSelectSkillNode(targetSkillNode);
      else {
        setSelectedNodes([]);
        toggleSelectSkillNode(targetSkillNode); // necessary bec this sets node description visibility (vs just doing setSelectedNodes([target]))
      }
    } else if (selectedNodes.length > 1) {
      console.log("enter");
      setSelectedNodes([targetSkillNode]);
    }
  }

  // SkillNode -> Effect
  // unselects modules and toggles selection of skill nodes
  function toggleSelectSkillNode(targetSkillNode) {
    if (selectedNodes[0]?.__data__.type === "module") {
      setIsNodeDescriptionVisible(true);
      setSelectedNodes([targetSkillNode]);
    } else if (!selectedNodes.includes(targetSkillNode)) {
      // cases: selectedNodes is empty, or contains other skills,
      setIsNodeDescriptionVisible(true);
      setSelectedNodes((arr) => [...arr, targetSkillNode]);
    } else {
      // selectedNodes includes target and this unselects it
      setSelectedNodes((arr) =>
        arr.filter((el) => el.__data__.id !== targetSkillNode.__data__.id)
      );
      setIsNodeDescriptionVisible(false);
    }
  }

  //ModuleNode -> Effect
  //select only one module at a time, cancelling selected skill nodes
  function toggleSelectModuleNode(target) {
    if (selectedNodes.includes(target)) setSelectedNodes([]); //toggle
    else setSelectedNodes([target]);
  }

  async function handleSubmit() {
    // validation?
    // merge currentTree to database tree if validation passes
    await mergeTree(currentTree);
    //go back to Home page
    navigate("/");
  }

  return (
    <>
      {isLoading && <h1>Loading</h1>}
      {error && <h1>{error}</h1>}
      {!isLoading && !error && (
        <D3Chart
          tree={currentTree}
          onNodeClick={handleNodeClick}
          onNodeTouchStart={handleNodeTouchStart}
          onNodeTouchEnd={handleNodeTouchEnd}
          className={styles.svgContainer}
          selectedNodeIds={selectedNodes.map((node) => node.id)}
        />
      )}
      <div className={styles.buttonDiv}>
        {selectedNodes.length > 0 ? (
          <button
            className={styles.plusButton}
            onClick={setIsModuleModalVisible}
          >
            +
          </button>
        ) : null}
      </div>
      <div
        className={styles.nodeDescription}
        style={{ display: isNodeDescriptionVisible ? "block" : "none" }}
      >
        <div>
          <h3>{currentNode?.__data__.title}</h3>
        </div>
        <p>{currentNode?.__data__.description}</p>
      </div>
      <div>
        <button onClick={handleSubmit}>Submit &rarr;</button>
      </div>

      {isModuleModalVisible && (
        <ModuleModal
          prerequisiteNodes={selectedNodes.map((node) => node.__data__)}
          setCurrentTree={setCurrentTree}
          setIsModuleModalVisible={setIsModuleModalVisible}
        />
      )}
    </>
  );
}

export default Edit;
