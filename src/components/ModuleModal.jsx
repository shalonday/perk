import "@mdxeditor/editor/style.css";
import { Suspense, useRef, useState } from "react";
import styles from "./ModuleModal.module.css";
import AddLinkModal from "./AddLinkModal";
import AddTargetNodeSection from "./AddTargetNodeSection";
import TextEditor from "./TextEditor";

function ModuleModal({ prerequisiteNodes }) {
  const [targetNodes, setTargetNodes] = useState([]);
  const [isAddLinkModalVisible, setIsAddLinkModalVisible] = useState(false);

  // function sent as setText prop to AddLinkModal; either setVisibleLearnBodyText or setVisiblePracticeBodyText
  const modalTextSetter = useRef(null);
  const [visibleLearnBodyText, setVisibleLearnBodyText] = useState("");
  const [visiblePracticeBodyText, setVisiblePracticeBodyText] = useState("");

  // Sent as prop to AddLinkModal. Represents the either learnBodyText or practiceBodyText
  // but with special strings that identify which parts of the text have hyperlinks.
  // This is to hide the ugly strings from user.
  const hiddenTextRef = useRef(null);
  const hiddenLearnBodyTextRef = useRef(visibleLearnBodyText);
  const hiddenPracticeBodyTextRef = useRef(visiblePracticeBodyText);

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

    hiddenTextRef.current = hiddenLearnBodyTextRef; //hiddenTextRef is essentially a ref to a ref
    modalTextSetter.current = setVisibleLearnBodyText;
    setIsAddLinkModalVisible(true);
  }

  function handleAddLinkPractice() {
    // get ref to focused textarea
    // concatenate link url or some other text or span to textarea via ref
    console.log("add link practice");
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
          setText={modalTextSetter.current}
          hiddenTextRef={hiddenTextRef.current}
          setIsAddLinkModalVisible={setIsAddLinkModalVisible}
          setResourcesArray={setResourcesArray}
        />
      )}
      <form
        className={isAddLinkModalVisible ? styles.formUndisplayed : styles.form}
      >
        <fieldset className={styles.title}>
          <h3>
            <input placeholder="[optional title]" />
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
          <TextEditor />

          <span onClick={handleAddLinkLearn}>[Add a hyperlink]</span>
        </fieldset>
        <fieldset className={styles.practice}>
          <h3>Practice</h3>
          <TextEditor />
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
