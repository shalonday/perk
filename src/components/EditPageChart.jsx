import D3Chart from "./D3Chart";
import styles from "./EditPageChart.module.css";

function EditPageChart({
  currentTree,
  selectedNodes,
  setSelectedNodes,
  setCurrentNode,
}) {
  let timer;
  const touchduration = 500;

  // click uses "e.target.__data__" while touch uses "e.subject"; this is because of how the click events are handled at D3Chart.jsx
  function handleNodeClick(e) {
    if (e.target.__data__.type === "module") {
      toggleSelectModuleNode(e.target.__data__);
    } else if (e.target.__data__.type === "skill") {
      handleSkillNodeClick(e);
    }
  }

  // necessary for handling long touches on touchscreen
  function handleNodeTouchStart(e) {
    if (window.matchMedia("(pointer: coarse)").matches) {
      //https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
      timer = setTimeout(() => {
        if (e.subject.type === "skill") toggleSelectSkillNode(e.subject);
        else if (e.subject.type === "module") toggleSelectModuleNode(e.subject);
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
      toggleSelectSkillNode(e.target.__data__);
    } else {
      selectOneSkillNodeAtATime(e.target.__data__);
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
      setSelectedNodes([targetSkillNode]);
    }
  }

  // SkillNode -> Effect
  // unselects modules and toggles selection of skill nodes
  function toggleSelectSkillNode(targetSkillNode) {
    if (selectedNodes[0]?.type === "module") {
      setCurrentNode(targetSkillNode);
      setSelectedNodes([targetSkillNode]);
    } else if (!selectedNodes.includes(targetSkillNode)) {
      // cases: selectedNodes is empty, or contains other skills,
      setCurrentNode(targetSkillNode);
      setSelectedNodes((arr) => [...arr, targetSkillNode]);
    } else {
      // selectedNodes includes target and this unselects it
      setSelectedNodes((arr) =>
        arr.filter((el) => el.id !== targetSkillNode.id)
      );
      setCurrentNode(null);
    }
  }

  //ModuleNode -> Effect
  //select only one module at a time, cancelling selected skill nodes
  function toggleSelectModuleNode(target) {
    if (selectedNodes.includes(target)) {
      setSelectedNodes([]);
      setCurrentNode(null);
    } //toggle
    else {
      setSelectedNodes([target]);
      setCurrentNode(target);
    }
  }

  return (
    <>
      <D3Chart
        tree={currentTree}
        onNodeClick={handleNodeClick}
        onNodeTouchStart={handleNodeTouchStart}
        onNodeTouchEnd={handleNodeTouchEnd}
        className={styles.svgContainer}
        selectedNodeIds={selectedNodes.map((node) => node.id)}
      />
    </>
  );
}

export default EditPageChart;
