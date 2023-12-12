import styles from "./Search.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useSkillTreesContext } from "../contexts/SkillTreesContext";
import { useState } from "react";
import SearchPageChart from "../components/SearchPageChart";
import MainButton from "../components/MainButton";

function Search() {
  const navigate = useNavigate();

  const { isLoading, setElementsToEdit, searchNodes, error } =
    useSkillTreesContext();

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedNodes, setSelectedNodes] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);

  function handleKeyDown(e) {
    if (e.key === "Enter") searchNodes(e.target.value);
  }

  function handleGeneratePath() {
    console.log(selectedNodes[0].id);
    navigate(`/s/0/e/${selectedNodes[0].id}`); // selectedNodes should only contain 1 element here.
  }

  function handlePlusClick() {
    console.log(selectedNodes);
    setElementsToEdit({
      nodes: selectedNodes,
      links: [],
    });
  }

  function buildParamStringFromArray(array) {
    let string = "";
    for (let i = 0; i < array.length; i++) {
      if (i < array.length - 1) string += array[i] + ",";
      else string += array[i]; // last element, so don't put an & at the end.
    }
    return string;
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
      <div className={styles.bottomThird}>
        {selectedNodes.length === 1 && (
          <MainButton onClick={handleGeneratePath}>Generate Path</MainButton>
        )}
        <div
          className={styles.nodeDescription}
          style={{ display: currentNode ? "block" : "none" }}
        >
          <div>
            <h3>{currentNode?.title}</h3>
            <h3>
              <Link
                to={`/edit/${buildParamStringFromArray(
                  selectedNodes.map((node) => node.id)
                )}`}
              >
                <button
                  className={styles.createButton}
                  onClick={handlePlusClick}
                >
                  +
                </button>
              </Link>
            </h3>
          </div>
          <p>{currentNode?.description}</p>
        </div>

        <div className={styles.inputDiv}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${styles.input} ${
              searchQuery ? styles.inputNoBackground : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default Search;
