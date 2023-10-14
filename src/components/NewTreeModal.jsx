import styles from "./Modal.module.css";

function NewTreeModal({ nodesArray, setIsNewTreeModalVisible }) {
  return (
    <>
      <div className={styles.backgroundBox}></div>
      <form className={styles.modal}>
        Pick starting node(s) for your tree:
        <select>
          {nodesArray.map((node) => (
            <option>{node.title}</option>
          ))}
        </select>
        ...Or{" "}
        <button onClick={() => setIsNewTreeModalVisible(false)}>create</button>{" "}
        your own
      </form>
    </>
  );
}

export default NewTreeModal;
