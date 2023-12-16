import styles from "./Tree.module.css";
import { useEffect, useState } from "react";
import TreeModuleView from "../components/TreeModuleView";
import TreePageChart from "../components/TreePageChart";
import NodeDescription from "../components/NodeDescription";
import MainButton from "../components/MainButton";
import { useSkillTreesContext } from "../contexts/SkillTreesContext";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";

// page for viewing "themed" trees or "branches" of the universal tree
function Tree() {
  const { startNodeId, endNodeId } = useParams();
  const { pathResult, searchPath, isLoading, error } = useSkillTreesContext(); // I think I'd rather render based on params instead
  const [clickedNode, setClickedNode] = useState(null);
  const [treeWithActiveNodes, setTreeWithActiveNodes] = useState(null);
  const [isModuleVisible, setIsModuleVisible] = useState(false);
  const activeNodesIdList = treeWithActiveNodes
    ? treeWithActiveNodes.nodes
        .filter((node) => node.active)
        .map((node) => node.id)
    : [startNodeId];
  // !!! while there is no user auth yet, use just start with the start node as active node.

  // Generate the path upon opening this page. I do this here instead of at
  // the Generate Path button on Search.jsx so that the path is based on url
  // params, making the same path easily shareable.
  // Scenario 1: A user w/o an account accesses the page and sees the path w/o any active nodes
  // Scenario 2: activeNodesIdList is updated from user account (or some uploaded json?) then treeWithActiveNodes is set from this
  useEffect(function initializeViewPart1() {
    searchPath(startNodeId, endNodeId);
  }, []);

  useEffect(
    function initializeViewPart2() {
      // set the active nodes once the pathResult is ready
      if (Object.keys(pathResult).length > 0)
        setTreeWithActiveNodes({
          nodes: pathResult.nodes.map((node) => {
            return activeNodesIdList?.includes(node.id)
              ? { ...node, active: true }
              : node;
          }),
          links: pathResult.links,
        });
    },
    [pathResult, startNodeId]
  );

  function handlePlayClick() {
    console.log("play was clicked");
    // play animation and then set activeNode to the next node. If it is a module node,
    // display the module view, and fold the Chart.
    setIsModuleVisible(true);
    const nextModule = getNextModule(activeNodesIdList);
    setClickedNode(nextModule); // set this even though no node was clicked, since "clickedNode" determines what's displayed
  }

  function getNextModule(activeNodeIds) {
    const reachableModule = treeWithActiveNodes.nodes.find((node) => {
      if (node.type === "module" && !node.active) {
        const prerequisiteNodes = getPrerequisiteNodes(node);
        const prereqIds = prerequisiteNodes.map((node) => node.id);

        const isPrereqActiveArray = prereqIds.map((id) =>
          activeNodeIds.includes(id)
        );
        const areAllPrereqsActive = isPrereqActiveArray.reduce(
          (acc, cur) => cur && acc
        );
        return areAllPrereqsActive;
      }
      return false;
    });
    return reachableModule;
  }

  function getPrerequisiteNodes(module) {
    const incomingLinks = treeWithActiveNodes.links.filter(
      (link) => link.target === module.id
    );
    const prerequisiteNodeIdsArray = incomingLinks.map((link) => link.source);
    const prerequisiteNodes = treeWithActiveNodes.nodes.filter((node) =>
      prerequisiteNodeIdsArray.includes(node.id)
    );
    return prerequisiteNodes;
  }

  return (
    <div>
      {clickedNode && <NodeDescription currentNode={clickedNode} />}
      {isLoading && <Loader />}
      {error && <h1>{error}</h1>}
      {!isLoading && !error && treeWithActiveNodes && (
        <TreePageChart
          branch={treeWithActiveNodes}
          clickedNode={clickedNode}
          setClickedNode={setClickedNode}
          setIsModuleVisible={setIsModuleVisible}
        />
      )}

      {/* <div>divider button</div> */}

      {isModuleVisible && (
        <TreeModuleView
          clickedNode={clickedNode}
          tree={treeWithActiveNodes}
          setTreeWithActiveNodes={setTreeWithActiveNodes}
          setIsModuleVisible={setIsModuleVisible}
        />
      )}
      {!isModuleVisible && (
        <div className={styles.playButtonDiv}>
          <MainButton onClick={handlePlayClick}>
            {activeNodesIdList.length > 1 ? "Continue" : "Start!"}
          </MainButton>
        </div>
      )}
    </div>
  );
}

export default Tree;
