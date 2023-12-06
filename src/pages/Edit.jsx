import styles from "./Edit.module.css";
import { useState } from "react";
import { useSkillTreesContext } from "../contexts/SkillTreesContext";
import ModuleModal from "../components/ModuleModal";
import { useNavigate } from "react-router-dom";
import EditPageChart from "../components/EditPageChart";

function Edit() {
  const { elementsToEdit, mergeTree, isLoading, error } =
    useSkillTreesContext();

  const navigate = useNavigate();

  const [currentTree, setCurrentTree] = useState(elementsToEdit);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [isModuleModalVisible, setIsModuleModalVisible] = useState(false);

  async function handleSubmit() {
    // validation?
    // merge currentTree to database tree if validation passes
    await mergeTree(currentTree);
    //go back to Home page
    navigate("/");
  }

  return (
    <>
      <div
        className={styles.mainDiv}
        style={
          isModuleModalVisible ? { display: "none" } : { display: "block" }
        }
      >
        <div
          className={styles.nodeDescription}
          style={{ display: currentNode ? "block" : "none" }}
        >
          <div>
            <h3>{currentNode?.__data__.title}</h3>
          </div>
          <p>{currentNode?.__data__.description}</p>
        </div>
        {isLoading && <h1>Loading</h1>}
        {error && <h1>{error}</h1>}
        {!isLoading && !error && (
          <EditPageChart
            currentTree={currentTree}
            selectedNodes={selectedNodes}
            setSelectedNodes={setSelectedNodes}
            setCurrentNode={setCurrentNode}
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

        <div>
          <button onClick={handleSubmit}>Submit &rarr;</button>
        </div>
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
