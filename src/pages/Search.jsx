import styles from "./Search.module.css";
import { Link } from "react-router-dom";
import { useSkillTreesContext } from "../contexts/SkillTreesContext";
import { useState } from "react";
import SearchPageChart from "../components/SearchPageChart";

function Search() {
  const { isLoading, setElementsToEdit, error } = useSkillTreesContext();

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedNodes, setSelectedNodes] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      console.log(e.target.value);
      // send searchQuery to backend, endpoint should write a Neo4j query based
      // on the searchQuery that will match nodes (skill AND modules ??? idk yet)
      // that CONTAIN the searchQuery.
      // afterwards, if there are results, empty the currentTree then change the currentTree to the
      // received Nodes. Otherwise, keep the currentTree, then display a temp
      // pop up message telling the user there were no results.
    }
  }

  // SVGArray -> RecordArray
  // Extract from the D3 SVGs the database records that were used to make them.
  function getDataObjectsFromD3Node(nodes) {
    return nodes.map((node) => {
      const { vx, vy, x, y, index, ...rest } = node.__data__;
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
        <SearchPageChart
          selectedNodes={selectedNodes}
          setSelectedNodes={setSelectedNodes}
          setCurrentNode={setCurrentNode}
        />
      )}
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div
        className={styles.nodeDescription}
        style={{ display: currentNode ? "block" : "none" }}
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
