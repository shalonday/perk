import styles from "./Modal.module.css";
import { useState } from "react";

export default function Modal({ source, setSourceArray, className }) {
  const [fromNode, setFromNode] = useState(source.fromNode);
  const [toNode, setToNode] = useState(source.toNode);
  const [title, setTitle] = useState(source.title);
  const [bullets, setBullets] = useState(source.detailsArray);

  function handleSubmit(e) {
    e.preventDefault();

    // use setArray methods here !!!

    source.type === "path" &&
      setSourceArray((array) =>
        array.map((item) =>
          item.id === source.id
            ? {
                ...item,
                title: title,
                detailsArray: bullets,
                fromNode: fromNode,
                toNode: toNode,
              }
            : item
        )
      );

    //{source.type==="node" && setSourceArray((array)=>)}
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
        {source.type === "path" && (
          <p>
            This path connects{" "}
            <select>
              <option>{source.fromNode}</option>
            </select>{" "}
            and{" "}
            <select>
              <option>{source.toNode}</option>
            </select>
          </p>
        )}
        <h3>
          <input
            type="text"
            placeholder={"Title: " + source.title}
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
