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

const BASE_URL = "http://localhost:3000";
const SkillTreesContext = createContext();

const initialState = {
  isLoading: false,
  universalTree: {},
  currentTree: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "universalTree/loaded":
      return { ...state, universalTree: action.payload, isLoading: false };
    case "tree/loaded":
      return {
        ...state,
        currentTree: action.payload,
        isLoading: false,
      };
    case "tree/merged":
      return {
        ...state,
        universalTree: [...state.universalTree, action.payload],
        isLoading: false,
      };
    case "tree/updated":
      return {
        ...state,
        universalTree: state.universalTree.map((tree) =>
          tree.id === action.payload.id ? action.payload : tree
        ),
        isLoading: false,
      };
    case "rejected":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error("action type not recognized");
  }
}

// SkillTreesContextProvider is wrapped around components (passed here as children prop) in App.jsx
// to give those components access to Skill Tree data. This allows for a central place from which
// to manage code related to accessing the data.
function SkillTreesContextProvider({ children }) {
  const [{ isLoading, universalTree, currentTree, error }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(function () {
    async function fetchuniversalTree() {
      //fetch trees created by user. in the future, need: recommendedTrees and followedTrees
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/tree`);
        const data = await res.json();
        dispatch({ type: "universalTree/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data",
        });
      }
    }
    fetchuniversalTree();
  }, []);

  // Get single tree by id. This will be used in the Edit page or Tree page to display a
  // tree that exists in the database.
  async function getTree(id) {
    if (id === currentTree.id) return; // no need to fetch if the currentTree is the same one being searched
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/trees/${id}`);
      const data = await res.json();
      dispatch({ type: "tree/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: `There was an error getting tree data for ID:${id}`,
      });
    }
  }

  async function mergeTree(nodesArray, linksArray) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/tree`, {
        method: "POST",
        body: JSON.stringify({ nodes: nodesArray, links: linksArray }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("Universal tree merged with data: " + data);
      dispatch({ type: "tree/merged", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: `There was an error uploading data for the tree`,
      });
    }
  }

  async function updateTree(newTree) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/trees/${newTree.id}`, {
        method: "PUT",
        body: JSON.stringify(newTree),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      dispatch({ type: "tree/updated", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: `There was an error uploading data for tree id ${newTree.id}`,
      });
    }
  }

  return (
    <SkillTreesContext.Provider
      value={{
        isLoading,
        universalTree,
        error,
        mergeTree,
        updateTree,
        getTree,
        currentTree,
      }}
    >
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
