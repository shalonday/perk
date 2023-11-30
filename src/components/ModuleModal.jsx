import "@mdxeditor/editor/style.css";
import { Suspense, useRef, useState } from "react";
import styles from "./ModuleModal.module.css";
import AddLinkModal from "./AddLinkModal";
import AddTargetNodeSection from "./AddTargetNodeSection";
import TextEditor from "./TextEditor";
import MainTextSection from "./MainTextSection";

function ModuleModal({ prerequisiteNodes }) {
  const [title, setTitle] = useState("");
  const [targetNodes, setTargetNodes] = useState([]);
  const [learnText, setLearnText] = useState("");
  const [practiceText, setPracticeText] = useState("");

  // Array of links added onto Learn and Practice sections.
  const [resourcesArray, setResourcesArray] = useState([]);

  // Int -> Effect
  // delete item in bullets array that corresponds to index
  function handleDeleteItem(index) {
    setTargetNodes((array) => array.filter((item, i) => i !== index));
  }

  // Add an empty item to detailsArray to be edited by user
  function handleAddItem(e) {
    e.preventDefault();
    setTargetNodes((array) => [...array, ""]);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // create a module object and target nodes objects
    // create the link objects
    // set the currentTree value by adding the new nodes and links to it
    // close the modal
  }

  return (
    <Suspense fallback={<p>Loading</p>}>
      <form className={styles.form}>
        <fieldset className={styles.title}>
          <h3>
            <input
              placeholder="[optional title]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </h3>
        </fieldset>
        <fieldset className={styles.prereqs}>
          <h3>Prerequisites</h3>
          <ul className={styles.prerequisitesList}>
            {prerequisiteNodes.map((node, i) => (
              <li key={i}>&#x2022;{node.title}</li>
            ))}
          </ul>
        </fieldset>
        <fieldset className={styles.targets}>
          <AddTargetNodeSection
            targetNodes={targetNodes}
            setTargetNodes={setTargetNodes}
            handleDeleteItem={handleDeleteItem}
            handleAddItem={handleAddItem}
          />
        </fieldset>
        <MainTextSection
          setLearnText={setLearnText}
          setPracticeText={setPracticeText}
          setResourcesArray={setResourcesArray}
        />
        <div className={styles.submitButtonDiv}>
          <button onClick={handleSubmit}>Submit &rarr;</button>
        </div>
        <div></div>
      </form>
    </Suspense>
  );
}

export default ModuleModal;
