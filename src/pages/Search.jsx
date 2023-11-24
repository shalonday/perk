import styles from "./Search.module.css";
import { Link } from "react-router-dom";
import D3Chart from "../components/D3Chart";
import { useSkillTreesContext } from "../contexts/SkillTreesContext";
import { useState } from "react";

function Search() {
  const { universalTree, isLoading } = useSkillTreesContext();
  const [isNodeDescriptionVisible, setIsNodeDescriptionVisible] =
    useState(false);
  const [clickedNode, setClickedNode] = useState(null);

  function handleNodeClick(e) {
    setIsNodeDescriptionVisible((val) => !val);
    setClickedNode(e.target);
    console.log(e.target.__data__);
  }

  return (
    <div>
      {isLoading ? (
        <h1>Loading</h1>
      ) : (
        <D3Chart
          tree={universalTree}
          onNodeClick={handleNodeClick}
          className={styles.svgContainer}
        />
      )}

      <div
        className={styles.nodeDescription}
        style={{ display: isNodeDescriptionVisible ? "block" : "none" }}
      >
        <div>
          <h3>{clickedNode?.__data__.title}</h3>
          <h3>
            <Link to={`/edit/${clickedNode?.id}`}>
              <button className={styles.createButton}>+</button>
            </Link>
          </h3>
        </div>
        <p>{clickedNode?.__data__.description}</p>
      </div>
    </div>
  );
}

export default Search;
