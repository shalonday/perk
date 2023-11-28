import styles from "./AddLinkModal.module.css";
import { useState } from "react";
import { uuidv4 } from "../utils";

function AddLinkModal({
  setText,
  hiddenTextRef,
  setIsAddLinkModalVisible,
  setResourcesArray,
}) {
  const [linkText, setLinkText] = useState("");
  const [url, setUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const resourceId = uuidv4();

    // includes a string of the form &&link text here @@linkidhere@@&& that will replace areas where user
    // wants to add a link. This makes it easy to transform into an <a> tag once it should be displayed.
    hiddenTextRef.current =
      hiddenTextRef.current + `&&${linkText}@@${resourceId}@@&&`;

    setText((text) => text + `[[${linkText}]]`);
    setResourcesArray((arr) => [...arr, { id: resourceId, url: url }]);
    setIsAddLinkModalVisible(false);
  }
  return (
    <form className={styles.form}>
      <fieldset>
        <textarea
          rows={1}
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <textarea
          placeholder="Link text"
          value={linkText}
          onChange={(e) => setLinkText(e.target.value)}
        />

        <div className={styles.submitButtonDiv}>
          <button onClick={handleSubmit}>Submit &rarr;</button>
        </div>
      </fieldset>
    </form>
  );
}

export default AddLinkModal;
