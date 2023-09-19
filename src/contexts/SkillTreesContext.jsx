// about the json objects:
// trees: skill trees containing skills and lpaths connected to each other
// skills: represented by circular "nodes" in a skill tree illustration, these represent skills prerequisite to or obtained by traversing a learning path
// lpaths: short for learning paths - represented by lines in a skill tree illustration, these represent activities to be done to obtain the skill referenced in its toNode property.
// for trees, uuid seems like a feasible id type since trees are unlike nodes and paths na may
//     pagkakasunud-sunod. for skills and paths, maybe a hexadecimal datatype would make sense?
//     or guid din kasi kung titingnan yung wiki universe, di naman magiging consistent yung ordering
//     unless one person creates the WHOLE universe.
// tree.skillIds, tree.lpathIds - ids of skills and lpaths contained in this tree
// course branches out after n3-n4 learning path. how to do this?

import { createContext } from "react";

const SkillTreesContext = createContext();

function SkillTreesContextProvider({ children }) {
  return <SkillTreesContext.Provider>{children}</SkillTreesContext.Provider>;
}

export { SkillTreesContextProvider };
