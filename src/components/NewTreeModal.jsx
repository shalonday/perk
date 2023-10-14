import { useState } from "react";
import styles from "./NewTreeModal.module.css";

function NewTreeModal({ nodesArray, setIsNewTreeModalVisible }) {
  const [title, setTitle] = useState("Tree Title");
  const [description, setDescription] = useState("Tree description here");
  return (
    <>
      <div className={styles.backgroundBox}></div>
      <form className={styles.modal}>
        <div className={styles.div}>
          <input
            className={styles.input}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            rows={10}
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.pickDiv}>
          <p classname={styles.pickP}>
            Pick starting node(s) for your tree:
            <select>
              {nodesArray.map((node) => (
                <option>{node.title}</option>
              ))}
            </select>
            ...Or{" "}
            <button onClick={() => setIsNewTreeModalVisible(false)}>
              create
            </button>{" "}
            your own
          </p>
        </div>
      </form>
    </>
  );
}

export default NewTreeModal;
