import { useEffect, useRef, useState } from "react";
import TreeModuleView from "../components/TreeModuleView";
import TreePageChart from "../components/TreePageChart";
import NodeDescription from "../components/NodeDescription";
import { useSkillTreesContext } from "../contexts/SkillTreesContext";
import { useParams } from "react-router-dom";

// page for viewing "themed" trees or "branches" of the universal tree
function Tree() {
  const { startNodeId, endNodeId } = useParams();
  const { pathResult, searchPath, isLoading, error } = useSkillTreesContext(); // I think I'd rather render based on params instead
  const [clickedNode, setClickedNode] = useState(null);
  const [treeWithActiveNodes, setTreeWithActiveNodes] = useState(null);
  const [isModuleVisible, setIsModuleVisible] = useState(false);
  const activeNodesIdList = useRef([]);

  // !!! while there is no user auth yet, use just start with the start node as active node.
  activeNodesIdList.current.push(startNodeId);

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
            if (activeNodesIdList.current.includes(node.id))
              return { ...node, active: true };
            else return node;
          }),
          links: pathResult.links,
        });
    },
    [pathResult, startNodeId]
  );

  function handlePlayClick() {
    // play animation and then set activeNode to the next node. If it is a module node,
    // display the module view, and fold the Chart.
  }

  return (
    <div>
      {isLoading && <h1>Loading</h1>}
      {error && <h1>{error}</h1>}
      {!isLoading && !error && treeWithActiveNodes && (
        <TreePageChart
          branch={treeWithActiveNodes}
          clickedNode={clickedNode}
          setClickedNode={setClickedNode}
        />
      )}

      <div>divider button</div>

      {isModuleVisible && <TreeModuleView module="" />}

      <button onClick={handlePlayClick}>
        Eye or Next Arrow or "Play" Arrow
      </button>
      {clickedNode && (
        <NodeDescription currentNode={clickedNode} className="smth" />
      )}
    </div>
  );
}

export default Tree;
