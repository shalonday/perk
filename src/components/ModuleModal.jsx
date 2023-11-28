import { useRef, useState } from "react";
import styles from "./ModuleModal.module.css";
import AddLinkModal from "./AddLinkModal";

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
  function handleAddDetail(e) {
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
          <h3>By the end of this module, the learner should be able to:</h3>
          <ul>
            {targetNodes.map((bullet, index) => (
              <li key={index} className={styles.targetNodeInputGroup}>
                <span onClick={() => handleDeleteItem(index)}>&#10005;</span>
                <textarea
                  className={styles.targetNodeTextarea}
                  rows={1}
                  value={bullet}
                  onChange={(e) => {
                    setTargetNodes((array) =>
                      array.map((item, i) =>
                        i === index ? e.target.value : item
                      )
                    ); // array == targetNodes; "item" is a bullet. This allows for changing the text in the current bullet
                  }}
                >
                  [Phrase starting with a verb representing the skill that will
                  be learned]
                </textarea>
              </li>
            ))}
            <button
              onClick={handleAddDetail}
              key="last"
              className={styles.addTargetButton}
            >
              +
            </button>
          </ul>
        </fieldset>
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
