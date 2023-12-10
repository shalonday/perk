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

const BASE_URL = "https://perk-api-production.up.railway.app"; //"http://localhost:3000"; //
const SkillTreesContext = createContext();

const initialState = {
  isLoading: true,
  universalTree: {},
  searchResult: {},
  pathResult: {},
  displayedTree: null,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "universalTree/loaded":
      return { ...state, universalTree: action.payload, isLoading: false };
    case "search/loaded":
      return {
        ...state,
        searchResult: action.payload,
        pathResult: {}, // ensure that searchResult and pathResult can't both be non-null at the same
        isLoading: false,
      };
    case "nodesById/loaded":
      return {
        ...state,
        displayedTree: action.payload,
        isLoading: false,
      };
    case "path/loaded":
      return {
        ...state,
        pathResult: action.payload,
        searchResult: {}, // the user has chosen from the results, so trash them
        isLoading: false,
      };
    case "tree/merged":
      const appendedTree = action.payload;

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

      const updatedUnivTree = {
        nodes: updatedUnivTreeNodes,
        links: state.universalTree.links,
      };

      // Array of nodes whose id's are not yet in universalTree
      const newNodes = appendedTree.nodes.filter(
        (appNode) =>
          !state.universalTree.nodes
            .map((univNode) => univNode.id)
            .includes(appNode.id)
      );
      const mergedUnivTreeLinks = updatedUnivTree.links.concat(
        appendedTree.links
      );
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
  const [
    {
      isLoading,
      universalTree,
      searchResult,
      pathResult,
      displayedTree,
      error,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

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

  // Send query to backend, which returns a (tree with only nodesArray populated or just nodesArray???)
  // based on the search query
  async function searchNodes(query) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/search/${query}`);
      const data = await res.json();
      dispatch({ type: "search/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: `There was an error searching for query:${query}`,
      });
    }
  }

  async function searchPath(startSkillNodeId, endSkillNodeId) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(
        `${BASE_URL}/pathStart/${startSkillNodeId}/pathEnd/${endSkillNodeId}`
      );
      const data = await res.json();
      dispatch({ type: "path/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: `There was an error searching for path`,
      });
    }
    // Query the database for a path of nodes and links (ie tree) from
    // the startNode to the EndNode. Add aggregation functions here???
    // "/pathStart/:startNode/pathEnd/:endNode"
  }

  // arrayString is a string of UUIDs attached to each other with &'s.
  async function getNodesById(arrayString) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/nodes/${arrayString}`);
      const data = await res.json();
      dispatch({ type: "nodesById/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: `There was an error getting nodes by id`,
      });
    }
  }

  async function mergeTree(tree) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}/tree`, {
        method: "POST",
        body: JSON.stringify(tree),
        headers: {
          "Content-Type": "application/json",
        },
      });
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
        searchNodes,
        searchResult,
        searchPath,
        getNodesById,
        displayedTree,
        pathResult,
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
