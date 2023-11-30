import "@mdxeditor/editor/style.css";
import { Suspense, useRef, useState } from "react";
import styles from "./ModuleModal.module.css";
import AddLinkModal from "./AddLinkModal";
import AddTargetNodeSection from "./AddTargetNodeSection";
import TextEditor from "./TextEditor";

function ModuleModal({ prerequisiteNodes }) {
  const [title, setTitle] = useState("");
  const [targetNodes, setTargetNodes] = useState([]);
  const [learnText, setLearnText] = useState("");
  const [practiceText, setPracticeText] = useState("");
  const [learnLinkText, setLearnLinkText] = useState("");
  const [practiceLinkText, setPracticeLinkText] = useState("");
  const linkTextSetter = useRef();

  const [isAddLinkModalVisible, setIsAddLinkModalVisible] = useState(false);

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

  function handleAddLinkLearn() {
    console.log("add link learn");
    linkTextSetter.current = setLearnLinkText;
    setIsAddLinkModalVisible(true);
  }

  function handleAddLinkPractice() {
    // get ref to focused textarea
    // concatenate link url or some other text or span to textarea via ref
    linkTextSetter.current = setPracticeLinkText;
    setIsAddLinkModalVisible(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // set the currentTree value by adding the new components to it
    // close the modal
  }

  return (
    <Suspense fallback={<p>Loading</p>}>
      {isAddLinkModalVisible && (
        <AddLinkModal
          linkTextSetter={linkTextSetter.current}
          setIsAddLinkModalVisible={setIsAddLinkModalVisible}
          setResourcesArray={setResourcesArray}
        />
      )}
      <form
        className={isAddLinkModalVisible ? styles.formUndisplayed : styles.form}
      >
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
        <fieldset className={styles.learn}>
          <h3>Learn</h3>
          <TextEditor
            textToAppend={learnLinkText}
            onChange={(markdown) => setLearnText(markdown)}
          />
          <span onClick={handleAddLinkLearn}>[Add a hyperlink]</span>
        </fieldset>
        <fieldset className={styles.practice}>
          <h3>Practice</h3>
          <TextEditor
            textToAppend={practiceLinkText}
            onChange={(markdown) => setPracticeText(markdown)}
          />
          <span onClick={handleAddLinkPractice}>[Add a hyperlink]</span>
        </fieldset>
        <div className={styles.submitButtonDiv}>
          <button onClick={handleSubmit}>Submit &rarr;</button>
        </div>
      </form>
    </Suspense>
  );
}

export default ModuleModal;
