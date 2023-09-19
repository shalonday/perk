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

import { createContext, useContext, useEffect, useReducer } from "react";

const BASE_URL = "http://localhost:8000";
const SkillTreesContext = createContext();

const initialState = {
  isLoading: false,
  createdTrees: [],
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "createdTrees/loaded":
      return { ...state, createdTrees: action.payload };
    case "rejected":
      return { ...state, error: action.payload };
    default:
      throw new Error("action type not recognized");
  }
}

// SkillTreesContextProvider is wrapped around components (children) in App.jsx to give those
// components access to Skill Tree data. This allows for a central place from which to manage
// code related to accessing the data.
function SkillTreesContextProvider({ children }) {
  const [{ isLoading, createdTrees, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCreatedTrees() {
      //fetch trees created by user. in the future, need: recommendedTrees and followedTrees
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/trees`);
        const data = await res.json();
        dispatch({ type: "createdTrees/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data",
        });
      }
    }
    fetchCreatedTrees();
  }, []);
  return (
    <SkillTreesContext.Provider value={{ isLoading, createdTrees, error }}>
      {children}
    </SkillTreesContext.Provider>
  );
}

// An exported function. useSkillTreesContext allows other components to access the
// context object provided to them by SkillTreesContextProvider. The context object
// contains the variables passed into the value prop of <SkillTreesContext.Provider>.
function useSkillTreesContext() {
  const context = useContext(SkillTreesContext);
  if (context === undefined) {
    throw new Error(
      "SkillTreesContext is being used outside of SkillTreesContextProvider"
    );
  }
  return context;
}

export { SkillTreesContextProvider, useSkillTreesContext };
