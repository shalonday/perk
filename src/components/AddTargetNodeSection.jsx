import styles from "./AddTargetNodeSection.module.css";
function AddTargetNodeSection({
  targetNodes,
  setTargetNodes,
  handleDeleteItem,
  handleAddItem,
}) {
  return (
    <>
      <h3>By the end of this module, the learner should be able to:</h3>
      <ul className={styles.targetList}>
        {targetNodes.map((bullet, index) => (
          <li key={index} className={styles.targetNodeInputGroup}>
            <span onClick={() => handleDeleteItem(index)}>&#10005;</span>
            <textarea
              className={styles.targetNodeTextarea}
              rows={1}
              value={bullet}
              onChange={(e) => {
                setTargetNodes((array) =>
                  array.map((item, i) => (i === index ? e.target.value : item))
                ); // array == targetNodes; "item" is a bullet. This allows for changing the text in the current bullet
              }}
            >
              [Phrase starting with a verb representing the skill that will be
              learned]
            </textarea>
          </li>
        ))}
        <button
          onClick={handleAddItem}
          key="last"
          className={styles.addTargetButton}
        >
          +
        </button>
      </ul>
    </>
  );
}

export default AddTargetNodeSection;
