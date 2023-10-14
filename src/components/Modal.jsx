import styles from "./Modal.module.css";
import { useState } from "react";

export default function Modal({
  clickedElement,
  nodesArray,
  setTree,
  setIsModalVisible,
  className,
}) {
  // source / sourceNode is where a path exits from
  const [sourceNode, setSourceNode] = useState(
    clickedElement.type === "path" && clickedElement.source
      ? clickedElement.source
      : nodesArray[0].id
  );

  // target / targetNode is the node at the end of a path
  const [targetNode, setTargetNode] = useState(
    clickedElement.type === "path" && clickedElement.target
      ? clickedElement.target
      : nodesArray[1].id
  );
  const [title, setTitle] = useState(clickedElement.title);
  const [bullets, setBullets] = useState(clickedElement.detailsArray);

  function handleSubmit(e) {
    e.preventDefault();

    // use setArray methods here !!!

    if (clickedElement.type === "path") {
      const editedPath = {
        ...clickedElement,
        title: title,
        detailsArray: bullets,
        source: sourceNode,
        target: targetNode,
      };

      setTree((tree) => {
        return {
          ...tree,
          links: tree.links.map((link) =>
            link.id === clickedElement.id ? editedPath : link
          ),
        };
      });
    }

    if (clickedElement.type === "node") {
      const editedNode = {
        ...clickedElement,
        title: title,
        detailsArray: bullets,
      };
      setTree((tree) => {
        return {
          ...tree,
          nodes: tree.nodes.map((node) =>
            node.id === clickedElement.id ? editedNode : node
          ),
        };
      });
    }

    setIsModalVisible(false);
  }
  // Int -> Effect
  // delete item in bullets array that corresponds to index
  function handleDeleteItem(index) {
    setBullets((array) => array.filter((item, i) => i !== index));
  }

  // Add an empty item to detailsArray to be edited by user
  function handleAddDetail() {
    setBullets((array) => [...array, ""]);
  }

  return (
    <>
      <div className={styles.backgroundBox}></div>
      <form onSubmit={handleSubmit} className={styles.modal}>
        {clickedElement.type === "path" && (
          <p>
            This path connects{" "}
            <select
              value={sourceNode}
              onChange={(e) => setSourceNode(e.target.value)}
            >
              {nodesArray.map((node) => (
                <option key={node.id} value={node.id}>
                  {"Node " + node.id}
                </option>
              ))}
            </select>{" "}
            and{" "}
            <select
              value={targetNode}
              onChange={(e) => setTargetNode(e.target.value)}
            >
              {nodesArray.map((node) => (
                <option key={node.id} value={node.id}>
                  {"Node " + node.id}
                </option>
              ))}
            </select>
          </p>
        )}
        <h3>
          <input
            type="text"
            placeholder={"Title: " + clickedElement.title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </h3>

        <ul>
          {bullets.map((bullet, index) => (
            <li key={index}>
              <input
                type="text"
                placeholder={bullet}
                value={bullet}
                onChange={(e) => {
                  setBullets((array) =>
                    array.map((item, i) =>
                      i === index ? e.target.value : item
                    )
                  ); // array == bullets; "item" is a bullet. This allows for changing the text in the current bullet
                }}
              />
              <span onClick={() => handleDeleteItem(index)}>❌</span>
            </li>
          ))}
          <p onClick={handleAddDetail} key="last">
            +
          </p>
        </ul>
        <div className={styles.buttonDiv}>
          <button className={`${styles.button} ${styles.cancelButton}`}>
            Cancel
          </button>
          <button className={`${styles.button} ${styles.saveButton}`}>
            Save
          </button>
        </div>
      </form>
    </>
  );
}
