import { useState } from "react";

function Search() {
  const [query, setQuery] = useState("");
  const createdTrees = [
    {
      id: "2ef94cdd-4077-4c36-92bb-5a3b09fc44d1",
      title: "ZTM's Become a Freelance Developer",
      desc: "The 'Become a Freelance Developer' Career Path from Zero To Mastery. Accessible via https://zerotomastery.io/career-paths/become-a-freelancer-2r7slf",
      tree: { skillIds: [0, 1, 2, 3, 4], lpathIds: [1, 2, 3, 4] },
    },
  ]; //sample
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {createdTrees.map((tree) => (
        <div key={tree.id}>
          <h3>{tree.title}</h3>
          <p>{tree.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default Search;
