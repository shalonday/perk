import styles from "./NodeDescription.module.css";
function NodeDescription({ currentNode }) {
  return (
    <div className={styles.nodeDescription}>
      <div>
        <h3>{currentNode?.title}</h3>
      </div>
      <p>{currentNode?.description}</p>
    </div>
  );
}

export default NodeDescription;
