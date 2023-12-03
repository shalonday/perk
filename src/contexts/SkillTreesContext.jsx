// about the json objects:
// universalTree: {nodes:[Objects], links:[Objects]}
// nodes: either a skill type node: {id: String, type:"skill", title:String, description (optional):String}
//        or a module type node: {id:String, type:"module", title:String, learnText:String, practiceText:String, resourcesArray:[Resource objects]}
// links: {source: uuid, target: uuid, id:uuid}
//        - source and target properties are requirements for D3Chart

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const BASE_URL = "https://perk-api-production.up.railway.app";
const SkillTreesContext = createContext();

const initialState = {
  isLoading: true,
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
      const appendedTree = action.payload;

      console.log("appendedTree");
      console.log(appendedTree);

      //Update node in universalTree if it's part of the appendedTree,
      //i.e., we're updating the node whether it was changed or not.
      const updatedUnivTreeNodes = state.universalTree.nodes.map((univNode) =>
        appendedTree.nodes
          .map((appendedTreeNode) => appendedTreeNode.id)
          .includes(univNode.id)
          ? appendedTree.nodes.filter(
              (appendedTreeNode) => appendedTreeNode.id === univNode.id
            )[0]
          : univNode
      );

      console.log("updatedUnivTreeNodes");
      console.log(updatedUnivTreeNodes);

      const updatedUnivTree = {
        nodes: updatedUnivTreeNodes,
        links: state.universalTree.links,
      };

      console.log("updatedUnivTree");
      console.log(updatedUnivTree);

      // Array of nodes whose id's are not yet in universalTree
      const newNodes = appendedTree.nodes.filter(
        (appNode) =>
          !state.universalTree.nodes
            .map((univNode) => univNode.id)
            .includes(appNode.id)
      );

      console.log(updatedUnivTree.links);
      const mergedUnivTreeLinks = updatedUnivTree.links.concat(
        appendedTree.links
      );

      console.log("updatedUnivTree.nodes");
      console.log(updatedUnivTree.nodes);
      const mergedUnivTreeNodes = updatedUnivTree.nodes.concat(newNodes);
      const mergedUnivTree = {
        nodes: mergedUnivTreeNodes,
        links: mergedUnivTreeLinks,
      };
      return {
        ...state,
        universalTree: mergedUnivTree,
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

  // Initial elements that will appear in Edit. These are set at Search.jsx, then accessed at Edit.jsx
  const [elementsToEdit, setElementsToEdit] = useState([]);

  useEffect(function () {
    async function fetchUniversalTree() {
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
    fetchUniversalTree();
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

  async function mergeTree(tree) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/tree`, {
        method: "POST",
        body: JSON.stringify(tree),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("Universal tree merged with data: ");
      console.log(data);
      dispatch({ type: "tree/merged", payload: tree });
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
        elementsToEdit,
        setElementsToEdit,
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
