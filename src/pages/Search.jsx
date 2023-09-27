import styles from "./Search.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function Search() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {/* put created trees here */}
      <Link to={`/edit/${uuidv4()}`}>
        <button className={styles.createButton}>Create New Tree</button>
      </Link>
    </div>
  );
}

//generate uuid; retrieved from https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid 4Sep2023
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export default Search;
