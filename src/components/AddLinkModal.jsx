import styles from "./AddLinkModal.module.css";
import { useState } from "react";
import { uuidv4 } from "../utils";

function AddLinkModal({
  linkTextSetter,
  setIsAddLinkModalVisible,
  setResourcesArray,
}) {
  const [resourceType, setResourceType] = useState("");
  const [price, setPrice] = useState(0);
  const [isbn, setISBN] = useState("");
  const [otherType, setOtherType] = useState("");
  const [linkText, setLinkText] = useState("");
  const [url, setUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const resourceId = uuidv4();
    linkTextSetter(`[${linkText}](${url})`);
    setResourcesArrayDependingOnType(resourceId);
    setIsAddLinkModalVisible(false);
  }

  function setResourcesArrayDependingOnType(resourceId) {
    switch (resourceType) {
      case "book":
        setResourcesArray((arr) => [
          ...arr,
          {
            id: resourceId,
            url: url,
            resourceType: "book",
            price: price,
            isbn: isbn,
          },
        ]);
        break;
      case "other":
        setResourcesArray((arr) => [
          ...arr,
          {
            id: resourceId,
            url: url,
            resourceType: `other: ${otherType}`,
            price: price,
          },
        ]);
        break;
      default:
        setResourcesArray((arr) => [
          ...arr,
          {
            id: resourceId,
            url: url,
            resourceType: resourceType,
            price: price,
          },
        ]);
    }
  }

  return (
    <div className={styles.form}>
      <fieldset>
        <select
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
        >
          <option>Select resource type</option>
          <option value="article">
            Online Article (Wikipedia, Medium, docs, blogs, etc.)
          </option>
          <option value="course">
            Online Course (Coursera, edx, Udemy, etc.)
          </option>
          <option value="video">
            Video or Video Playlist (Youtube, Vimeo, etc.)
          </option>
          <option value="book">
            Book (online bookstores, online archives, etc.)
          </option>
          <option value="forum">
            Forum or Q&A (Stack Overflow, Reddit, etc.)
          </option>
          <option value="audio">
            Audio (Apple Podcasts, Spotify Podcasts, etc.)
          </option>
          <option value="image">
            Image or Image Album (Museum or gallery websites, etc.)
          </option>
          <option value="other">Other document</option>
        </select>
        <div className={styles.sectionDiv}>
          <label htmlFor="price">Price (USD):</label>
          <input
            id="price"
            placeholder="Enter resource price in USD (Enter 0 if free)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {resourceType === "book" && (
          <div className={styles.sectionDiv}>
            <label htmlFor="ISBN">ISBN: </label>
            <input
              id="ISBN"
              placeholder="(optional) Enter Book ISBN here"
              value={isbn}
              onChange={(e) => setISBN(e.target.value)}
            />
          </div>
        )}
        {resourceType === "other" && (
          <div className={styles.sectionDiv}>
            <label htmlFor="other">Other resource type:</label>
            <input
              id="other"
              placeholder="Enter resource type"
              value={otherType}
              onChange={(e) => setOtherType(e.target.value)}
            />
          </div>
        )}
        <div className={styles.sectionDiv}>
          <label htmlFor="url">URL</label>
          <input
            id="url"
            placeholder="Enter URL starting with http:// or https://"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className={styles.sectionDiv}>
          <label htmlFor="text">Text</label>
          <textarea
            placeholder="Enter the text that will be linked to the URL"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
        </div>

        <div className={styles.submitButtonDiv}>
          <button onClick={handleSubmit}>+ Add Link</button>
        </div>
      </fieldset>
    </div>
  );
}

export default AddLinkModal;
