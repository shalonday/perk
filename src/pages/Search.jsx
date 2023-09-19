import { useState } from "react";

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
      <button>Create Tree</button>
    </div>
  );
}

export default Search;
