import { useState } from "react";
import styles from "./NewTreeModal.module.css";
import { SVG_HEIGHT, SVG_WIDTH, uuidv4 } from "../utils";

function NewTreeModal({
  tree,
  setIsNewTreeModalVisible,
  setTree,
  setClickedElement,
  setIsModalVisible,
}) {
  const [title, setTitle] = useState(tree.title);
  const [description, setDescription] = useState(tree.description);
  const FIXED_X_COORDINATE = SVG_WIDTH / 2;
  const FIXED_Y_COORDINATE = (SVG_HEIGHT - 200) / 2;

  function handleSubmit(e) {
    e.preventDefault();

    setTree((tree) => {
      return { ...tree, title: title, description: description };
    });
    setIsNewTreeModalVisible(false);
  }

  // Open an Add Node modal, in addition to the normal submission logic
  function handleCreateRoot(e) {
    handleSubmit(e);

    const newNode = {
      id: uuidv4(),
      title: "",
      type: "node",
      detailsArray: [],
      fx: FIXED_X_COORDINATE,
      fy: FIXED_Y_COORDINATE,
    };
    setTree((tree) => {
      return { ...tree, rootId: newNode.id };
    });
    setClickedElement(newNode);
    setIsModalVisible(true);
  }

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
          <p className={styles.pickP}>
            Pick starting node(s) for your tree:
            <select multiple>
              {tree.nodes.map((node) => (
                <option key={node.id}>{node.title}</option>
              ))}
            </select>
            ...Or{" "}
            <button onClick={handleCreateRoot} disabled={tree.nodes.length > 0}>
              create
            </button>{" "}
            your own
          </p>
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </>
  );
}

export default NewTreeModal;
