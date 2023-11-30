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
        <select>
          <option>Select resource type</option>
          <option>Online Article (Wikipedia, Medium, blogs, etc.)</option>
          <option>Online Course (Coursera, edx, Udemy, etc.)</option>
          <option>Video or Video Playlist (Youtube, Vimeo, etc.)</option>
          <option>Book (online bookstores, online archives, etc.)</option>
          <option>Q&A or Forum (Stack Overflow, Reddit, etc.)</option>
          <option>Audio (Apple Podcasts, Spotify Podcasts, etc.)</option>
          <option>
            Image or Image Album (Museum or gallery websites, etc.)
          </option>
          <option>Other document</option>
        </select>
        <label htmlFor="price">Price (USD):</label>
        <input
          id="price"
          placeholder="Enter resource price in USD (Enter 0 if free)"
        />
        <label htmlFor="ISBN">ISBN: </label>
        <input id="ISBN" placeholder="(optional) Enter Book ISBN here" />
        <label htmlFor="other">Other resource type:</label>
        <input id="other" placeholder="Enter resource type" />
        <label htmlFor="url">URL</label>
        <input
          id="url"
          placeholder="Enter URL starting with http:// or https://"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <label htmlFor="text">Text</label>
        <textarea
          placeholder="Enter the text that will be linked to the URL"
          value={linkText}
          onChange={(e) => setLinkText(e.target.value)}
        />

        <div className={styles.submitButtonDiv}>
          <button onClick={handleSubmit}>+ Add Link</button>
        </div>
      </fieldset>
    </form>
  );
}

export default AddLinkModal;
