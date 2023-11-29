import "@mdxeditor/editor/style.css";
import { useRef, useState } from "react";
import styles from "./ModuleModal.module.css";
import AddLinkModal from "./AddLinkModal";
import { MDXEditor, headingsPlugin } from "@mdxeditor/editor";
import AddTargetNodeSection from "./AddTargetNodeSection";

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
    <>
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
        <fieldset>
          <h3>
            <input placeholder="[optional title]" />
          </h3>
        </fieldset>
        <fieldset>
          <h3>Prerequisites</h3>
          <ul className={styles.prerequisitesList}>
            {prerequisiteNodes.map((node, i) => (
              <li key={i}>&#x2022;{node.title}</li>
            ))}
          </ul>
        </fieldset>
        <fieldset>
          <AddTargetNodeSection
            targetNodes={targetNodes}
            setTargetNodes={setTargetNodes}
            handleDeleteItem={handleDeleteItem}
            handleAddItem={handleAddItem}
          />
        </fieldset>
        <MDXEditor markdown="# Hello world" plugins={[headingsPlugin()]} />
        <fieldset>
          <h3>Learn</h3>
          <textarea
            rows={3}
            value={visibleLearnBodyText}
            onChange={(e) => setVisibleLearnBodyText(e.target.value)}
            placeholder="Discuss in this section the material that will be consumed by the learner, ie., lecture videos, articles, books/book chapters, etc."
          />

          <span onClick={handleAddLinkLearn}>[Add a hyperlink]</span>
        </fieldset>
        <fieldset>
          <h3>Practice</h3>
          <textarea
            rows={3}
            placeholder="Practice exercises that let the learner make use of what they just
            learned to build mastery"
          />
          <span onClick={handleAddLinkPractice}>[Add a hyperlink]</span>
        </fieldset>
        <div className={styles.submitButtonDiv}>
          <button onClick={handleSubmit}>Submit &rarr;</button>
        </div>
      </form>
    </>
  );
}

export default ModuleModal;
