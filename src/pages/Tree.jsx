import { useEffect, useState } from "react";
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
  const [activeNode, setActiveNode] = useState(null);
  const [isModuleVisible, setIsModuleVisible] = useState(false);

  // Generate the path upon opening this page. I do this here instead of at
  // the Generate Path button on Search.jsx so that the path is based on url
  // params, making the same path easily shareable.
  useEffect(function () {
    // generate the path, then set the active node to the first node in the path.
    async function setUpTreePage() {
      await searchPath(startNodeId, endNodeId);
      setActiveNode(pathResult.nodes.filter((node) => node.id === startNodeId));
    }
    setUpTreePage();
  }, []);

  function handlePlayClick() {
    // play animation and then set activeNode to the next node. If it is a module node,
    // display the module view, and fold the Chart.
  }

  return (
    <div>
      {isLoading && <h1>Loading</h1>}
      {error && <h1>{error}</h1>}
      {!isLoading && !error && (
        <TreePageChart
          tree={pathResult}
          currentNode={clickedNode}
          setCurrentNode={setClickedNode}
        />
      )}

      <div>divider button</div>

      {isModuleVisible && <TreeModuleView module={activeNode} />}

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
