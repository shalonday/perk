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
  currentTree: {},
  currentNode: {},
  currentLink: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "createdTrees/loaded":
      return { ...state, createdTrees: action.payload, isLoading: false };
    case "tree/loaded":
      return {
        ...state,
        currentTree: action.payload,
        isLoading: false,
      };
    case "tree/created":
      return {
        ...state,
        createdTrees: [...state.createdTrees, action.payload],
        isLoading: false,
      };
    case "tree/updated":
      return {
        ...state,
        createdTrees: state.createdTrees.map((tree) =>
          tree.id === action.payload.id ? action.payload : tree
        ),
        isLoading: false,
      };
    case "node/loaded":
      return {
        ...state,
        currentNode: action.payload,
        isLoading: false,
      };
    // I don't think there's any other state I'd need to update because this doesn't
    // need to reflect any change in the UI. Same with node/updated
    case "node/created":
      return {
        ...state,
        isLoading: false,
      };
    case "node/updated":
      return {
        ...state,
        isLoading: false,
      };
    case "link/loaded":
      return {
        ...state,
        currentLink: action.payload,
        isLoading: false,
      };
    case "link/created":
      return {
        ...state,
        isLoading: false,
      };
    case "link/updated":
      return {
        ...state,
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
  const [
    { isLoading, createdTrees, currentTree, currentNode, currentLink, error },
    dispatch,
  ] = useReducer(reducer, initialState);

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

  async function createTree(newTree) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/trees`, {
        method: "POST",
        body: JSON.stringify(newTree),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "tree/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error uploading data",
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
        payload: "There was an error uploading data",
      });
    }
  }

  // Get single node by id
  async function getNode(id) {
    if (id === currentNode.id) return; // no need to fetch if the currentNode is the same one being searched
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/nodes/${id}`);
      const data = await res.json();
      dispatch({ type: "node/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: `There was an error getting node data for ID:${id}`,
      });
    }
  }

  async function createNode(newNode) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/nodes`, {
        method: "POST",
        body: JSON.stringify(newNode),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("new node created: " + data);
      dispatch({ type: "node/created" }); // no need for payload because there's no UI change the data needs to be used for.
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error uploading data",
      });
    }
  }

  async function updateNode(newNode) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/nodes/${newNode.id}`, {
        method: "PUT",
        body: JSON.stringify(newNode),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("node updated: " + data);
      dispatch({ type: "node/updated" });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error uploading data",
      });
    }
  }

  // Get single link by id
  async function getLink(id) {
    if (id === currentLink.id) return; // no need to fetch if the currentNode is the same one being searched
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/links/${id}`);
      const data = await res.json();
      dispatch({ type: "link/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: `There was an error getting link data for ID:${id}`,
      });
    }
  }

  async function createLink(newLink) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/links`, {
        method: "POST",
        body: JSON.stringify(newLink),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("new link created: " + data);
      dispatch({ type: "link/created" }); // no need for payload because there's no UI change the data needs to be used for.
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error uploading data",
      });
    }
  }

  async function updateLink(newLink) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/links/${newLink.id}`, {
        method: "PUT",
        body: JSON.stringify(newLink),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("link updated: " + data);
      dispatch({ type: "link/updated" });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error uploading data",
      });
    }
  }

  return (
    <SkillTreesContext.Provider
      value={{
        isLoading,
        createdTrees,
        error,
        createTree,
        updateTree,
        getTree,
        currentTree,
        getNode,
        createNode,
        updateNode,
        currentNode,
        getLink,
        createLink,
        updateLink,
        currentLink,
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
